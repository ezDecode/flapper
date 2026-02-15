import { BlueskyService } from "../_shared/bluesky.ts";
import { err, handleCors, json } from "../_shared/cors.ts";
import { plugFailed } from "../_shared/email-templates.ts";
import { LinkedInService } from "../_shared/linkedin.ts";
import { admin, isServiceRoleRequest } from "../_shared/supabase-admin.ts";
import { TwitterService } from "../_shared/twitter.ts";

function appendUtm(content: string, platform: "TWITTER" | "LINKEDIN" | "BLUESKY") {
  const utm = `utm_source=${platform.toLowerCase()}&utm_medium=autoplug&utm_campaign=flapr`;
  return content.replace(/https?:\/\/[^\s]+/g, (url) => {
    if (url.includes("utm_source=")) return url;
    return `${url}${url.includes("?") ? "&" : "?"}${utm}`;
  });
}

async function sendPlugFailureEmail(userId: string, platform: string, content: string, reason: string) {
  const { data: user } = await admin.from("users").select("email").eq("id", userId).single();
  if (!user?.email) return;
  const payload = plugFailed(platform, content, reason);
  await fetch(`${Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")}/functions/v1/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
    },
    body: JSON.stringify({ to: user.email, ...payload })
  });
}

function metricForTrigger(
  triggerType: "LIKES" | "COMMENTS" | "REPOSTS" | "TIME_AFTER_PUBLISH",
  metrics: { likes: number; comments: number; reposts: number }
) {
  if (triggerType === "COMMENTS") return metrics.comments;
  if (triggerType === "REPOSTS") return metrics.reposts;
  return metrics.likes;
}

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;
  if (!isServiceRoleRequest(req)) return err("Service role authorization required", 401);

  try {
    const { data: plugs, error: plugsError } = await admin
      .from("auto_plugs")
      .select("id, post_id, platform, plug_content, trigger_type, trigger_value, status")
      .eq("status", "PENDING")
      .limit(50);

    if (plugsError) return err(plugsError.message, 500);
    if (!plugs || plugs.length === 0) return json({ polled: 0, fired: 0, failed: 0 });

    let fired = 0;
    let failed = 0;

    for (const plug of plugs) {
      const { data: post } = await admin.from("posts").select("user_id").eq("id", plug.post_id).single();
      const { data: target } = await admin
        .from("post_targets")
        .select("id, platform_post_id, bluesky_cid")
        .eq("post_id", plug.post_id)
        .eq("platform", plug.platform)
        .single();
      const { data: connection } = await admin
        .from("platform_connections")
        .select("access_token, platform_handle, is_active")
        .eq("user_id", post?.user_id ?? "")
        .eq("platform", plug.platform)
        .eq("is_active", true)
        .single();

      if (!post || !target || !target.platform_post_id || !connection?.access_token) {
        failed += 1;
        await admin.from("auto_plugs").update({ status: "FAILED", fail_reason: "Missing target or connection" }).eq("id", plug.id);
        continue;
      }

      try {
        let metrics = { likes: 0, comments: 0, reposts: 0 };
        let plugPostId = "";
        const finalPlugContent = appendUtm(plug.plug_content, plug.platform);

        if (plug.platform === "TWITTER") {
          const service = await TwitterService.fromEncrypted(connection.access_token);
          metrics = await service.getTweetMetrics(target.platform_post_id);
          if (metricForTrigger(plug.trigger_type, metrics) >= plug.trigger_value) {
            const response = await service.replyToTweet(target.platform_post_id, finalPlugContent);
            plugPostId = response.id;
          }
        } else if (plug.platform === "LINKEDIN") {
          const service = await LinkedInService.fromEncrypted(connection.access_token);
          metrics = { ...(await service.getPostEngagement(target.platform_post_id)), reposts: 0 };
          if (metricForTrigger(plug.trigger_type, metrics) >= plug.trigger_value) {
            const urn = await service.getMyUrn();
            const response = await service.addComment(target.platform_post_id, finalPlugContent, urn);
            plugPostId = response.id;
          }
        } else if (plug.platform === "BLUESKY") {
          const service = await BlueskyService.fromEncrypted(connection.platform_handle, connection.access_token);
          const likes = await service.getLikesCount(target.platform_post_id);
          metrics = { likes, comments: 0, reposts: 0 };
          if (metricForTrigger(plug.trigger_type, metrics) >= plug.trigger_value) {
            if (!target.bluesky_cid) {
              throw new Error("Missing Bluesky CID for reply");
            }
            const response = await service.replyToPost(target.platform_post_id, target.bluesky_cid, finalPlugContent);
            plugPostId = response.uri;
          }
        }

        await admin
          .from("post_targets")
          .update({
            likes_count: metrics.likes,
            comments_count: metrics.comments,
            reposts_count: metrics.reposts,
            last_polled_at: new Date().toISOString()
          })
          .eq("id", target.id);

        if (plugPostId) {
          fired += 1;
          await admin
            .from("auto_plugs")
            .update({
              status: "FIRED",
              fired_at: new Date().toISOString(),
              plug_post_id: plugPostId,
              fail_reason: null
            })
            .eq("id", plug.id);
        }
      } catch (error) {
        failed += 1;
        const message = error instanceof Error ? error.message : "Polling failed";
        await admin.from("auto_plugs").update({ status: "FAILED", fail_reason: message }).eq("id", plug.id);
        await sendPlugFailureEmail(post.user_id, plug.platform, plug.plug_content, message);
      }
    }

    return json({ polled: plugs.length, fired, failed });
  } catch (error) {
    return err(error instanceof Error ? error.message : "poll-engagement failed", 500);
  }
});
