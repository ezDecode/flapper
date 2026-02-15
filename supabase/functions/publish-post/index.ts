import { BlueskyService } from "../_shared/bluesky.ts";
import { err, handleCors, json } from "../_shared/cors.ts";
import { postFailed } from "../_shared/email-templates.ts";
import { LinkedInService } from "../_shared/linkedin.ts";
import { admin, getUserFromRequest, isServiceRoleRequest } from "../_shared/supabase-admin.ts";
import { TwitterService } from "../_shared/twitter.ts";
import { checkAndEnforceLimit, checkRateLimit, LimitExceededError } from "../_shared/usage.ts";
import { validatePostContent } from "../_shared/validators.ts";

type Body = {
  post_id?: string;
};

function classifyError(message: string) {
  return /429|5\d{2}|timeout|temporar/i.test(message) ? "TRANSIENT" : "PERMANENT";
}

async function sendFailureEmail(userId: string, platform: string, content: string, reason: string) {
  const { data: user } = await admin.from("users").select("email").eq("id", userId).single();
  if (!user?.email) return;

  const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:3000";
  const email = postFailed(platform, content.slice(0, 120), reason, `${siteUrl}/dashboard`);
  await fetch(`${Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")}/functions/v1/send-email`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      to: user.email,
      ...email
    })
  });
}

async function publishToPlatform(
  platform: "TWITTER" | "LINKEDIN" | "BLUESKY",
  content: string,
  connection: {
    access_token: string;
    platform_handle: string;
  },
  currentTarget: {
    platform_post_id: string | null;
    bluesky_cid: string | null;
  }
) {
  if (platform === "TWITTER") {
    const service = await TwitterService.fromEncrypted(connection.access_token);
    const result = await service.publishTweet(content);
    return { platformPostId: result.id, platformPostUrl: result.url, blueskyCid: null };
  }

  if (platform === "LINKEDIN") {
    const service = await LinkedInService.fromEncrypted(connection.access_token);
    const authorUrn = await service.getMyUrn();
    const result = await service.publishPost(content, authorUrn);
    return { platformPostId: result.id, platformPostUrl: `https://www.linkedin.com/feed/update/${result.id}`, blueskyCid: null };
  }

  const service = await BlueskyService.fromEncrypted(connection.platform_handle, connection.access_token);
  const result = await service.publishPost(content);
  return {
    platformPostId: result.uri,
    platformPostUrl: result.uri,
    blueskyCid: result.cid ?? currentTarget.bluesky_cid
  };
}

async function processPost(post: {
  id: string;
  user_id: string;
  content: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED";
  retry_count: number;
}) {
  await checkAndEnforceLimit(post.user_id, "PUBLISH");

  const { data: targets } = await admin.from("post_targets").select("*").eq("post_id", post.id);
  if (!targets || targets.length === 0) {
    await admin.from("posts").update({ status: "FAILED", fail_reason: "No post targets configured." }).eq("id", post.id);
    return { publishedTargets: 0, failedTargets: 1 };
  }

  let publishedTargets = 0;
  let failedTargets = 0;

  for (const target of targets) {
    const platform = target.platform;
    const validation = validatePostContent(post.content, platform);
    if (!validation.valid) {
      failedTargets += 1;
      await admin
        .from("post_targets")
        .update({ fail_reason: validation.errors.join(" "), published_at: null })
        .eq("id", target.id);
      await admin.from("posts").update({ status: "FAILED", fail_reason: validation.errors.join(" ") }).eq("id", post.id);
      await sendFailureEmail(post.user_id, platform, post.content, validation.errors.join(" "));
      continue;
    }

    const rateAllowed = await checkRateLimit(post.user_id, platform);
    if (!rateAllowed) {
      await admin
        .from("posts")
        .update({
          status: "SCHEDULED",
          scheduled_at: new Date(Date.now() + 16 * 60 * 1000).toISOString(),
          fail_reason: "Rate limited. Rescheduled 16 minutes."
        })
        .eq("id", post.id);
      continue;
    }

    const { data: connection } = await admin
      .from("platform_connections")
      .select("access_token, platform_handle, is_active")
      .eq("user_id", post.user_id)
      .eq("platform", platform)
      .eq("is_active", true)
      .single();

    if (!connection?.access_token) {
      failedTargets += 1;
      await admin.from("post_targets").update({ fail_reason: "Missing active connection." }).eq("id", target.id);
      await admin.from("posts").update({ status: "FAILED", fail_reason: "Missing active platform connection." }).eq("id", post.id);
      await sendFailureEmail(post.user_id, platform, post.content, "Missing active platform connection.");
      continue;
    }

    try {
      const result = await publishToPlatform(platform, post.content, connection, target);
      await admin
        .from("post_targets")
        .update({
          platform_post_id: result.platformPostId,
          platform_post_url: result.platformPostUrl,
          bluesky_cid: result.blueskyCid,
          published_at: new Date().toISOString(),
          fail_reason: null
        })
        .eq("id", target.id);
      publishedTargets += 1;
    } catch (error) {
      failedTargets += 1;
      const message = error instanceof Error ? error.message : "Platform publish failed";
      const errorType = classifyError(message);

      if (errorType === "TRANSIENT") {
        await admin
          .from("posts")
          .update({
            status: "FAILED",
            retry_count: post.retry_count + 1,
            next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            fail_reason: message
          })
          .eq("id", post.id);
      } else {
        await admin.from("posts").update({ status: "FAILED", fail_reason: message }).eq("id", post.id);
      }
      await admin.from("post_targets").update({ fail_reason: message }).eq("id", target.id);
      await sendFailureEmail(post.user_id, platform, post.content, message);
    }
  }

  if (failedTargets === 0 && publishedTargets > 0) {
    await admin.from("posts").update({ status: "PUBLISHED", published_at: new Date().toISOString(), fail_reason: null }).eq("id", post.id);
  }

  return { publishedTargets, failedTargets };
}

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  const batchMode = isServiceRoleRequest(req);

  try {
    const body = (await req.json().catch(() => ({}))) as Body;
    let userId: string | null = null;

    if (!batchMode) {
      const user = await getUserFromRequest(req);
      userId = user.id;
    }

    let posts:
      | Array<{
          id: string;
          user_id: string;
          content: string;
          status: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED";
          retry_count: number;
        }>
      | null = null;

    if (body.post_id) {
      const query = admin.from("posts").select("id, user_id, content, status, retry_count").eq("id", body.post_id);
      if (userId) query.eq("user_id", userId);
      const { data, error: postError } = await query;
      if (postError) return err(postError.message, 500);
      posts = data;
    } else if (!batchMode) {
      return err("post_id is required for user-initiated publish", 400);
    } else {
      const now = new Date().toISOString();
      const [scheduled, retries] = await Promise.all([
        admin
          .from("posts")
          .select("id, user_id, content, status, retry_count")
          .eq("status", "SCHEDULED")
          .lte("scheduled_at", now)
          .limit(20),
        admin
          .from("posts")
          .select("id, user_id, content, status, retry_count")
          .eq("status", "FAILED")
          .lt("retry_count", 3)
          .lte("next_retry_at", now)
          .limit(20)
      ]);
      if (scheduled.error) return err(scheduled.error.message, 500);
      if (retries.error) return err(retries.error.message, 500);
      const merged = [...(scheduled.data ?? []), ...(retries.data ?? [])];
      const unique = new Map<string, (typeof merged)[number]>();
      merged.forEach((post) => unique.set(post.id, post));
      posts = Array.from(unique.values()).slice(0, 20);
    }

    if (!posts || posts.length === 0) return json({ processed: 0, publishedTargets: 0, failedTargets: 0 });

    let processed = 0;
    let publishedTargets = 0;
    let failedTargets = 0;

    for (const post of posts) {
      try {
        const result = await processPost(post);
        processed += 1;
        publishedTargets += result.publishedTargets;
        failedTargets += result.failedTargets;
      } catch (error) {
        if (error instanceof LimitExceededError) {
          await admin.from("posts").update({ status: "FAILED", fail_reason: error.message }).eq("id", post.id);
          continue;
        }
        const message = error instanceof Error ? error.message : "Post processing failed";
        await admin.from("posts").update({ status: "FAILED", fail_reason: message }).eq("id", post.id);
      }
    }

    return json({ processed, publishedTargets, failedTargets });
  } catch (error) {
    return err(error instanceof Error ? error.message : "publish-post failed", 500);
  }
});
