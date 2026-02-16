import { BlueskyService } from "../_shared/bluesky.ts";
import { err, handleCors, json } from "../_shared/cors.ts";
import { plugFailed } from "../_shared/email-templates.ts";
import { LinkedInService } from "../_shared/linkedin.ts";
import { admin, isServiceRoleRequest } from "../_shared/supabase-admin.ts";
import { TwitterService } from "../_shared/twitter.ts";

import { validatePostContent } from "../_shared/validators.ts";

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
      .select(`
        id, post_id, platform, plug_content, trigger_type, trigger_value, status,
        posts!inner ( user_id ),
        post_targets!inner (
          id, platform_post_id, bluesky_cid,
          likes_count, comments_count, reposts_count
        ),
        platform_connections!inner ( access_token, platform_handle, is_active )
      `)
      .eq("status", "PENDING")
      .eq("platform_connections.is_active", true)
      .limit(50);

    if (plugsError) return err(plugsError.message, 500);
    // @ts-ignore: explicit check for empty array
    if (!plugs || plugs.length === 0) return json({ polled: 0, fired: 0, failed: 0 });

    let fired = 0;
    let failed = 0;

    // @ts-ignore: Supabase join types are sometimes inferred strictly, we prioritize the manual logic correctness here
    for (const plug of plugs) {
      // Access joined data directly
      const post = plug.posts; // { user_id }
      const target = plug.post_targets; // { id, platform_post_id, ... }
      const connection = plug.platform_connections; // { access_token, ... }

      // 1. Validate Plug Content (Issue 11)
      const trimmedPlugContent = plug.plug_content.trim();
      if (!trimmedPlugContent) {
         failed += 1;
         await admin.from("auto_plugs").update({
           status: "FAILED",
           fail_reason: "Plug content is empty."
         }).eq("id", plug.id);
         continue;
      }

      const plugValidation = validatePostContent(trimmedPlugContent, plug.platform);
      if (!plugValidation.valid) {
        failed += 1;
        await admin.from("auto_plugs").update({
          status: "FAILED",
          fail_reason: plugValidation.errors.join(" ")
        }).eq("id", plug.id);
        continue;
      }

      // 2. Optimistic Skip (Issue 5)
      const currentlyKnownMetrics = {
        likes: target.likes_count ?? 0,
        comments: target.comments_count ?? 0,
        reposts: target.reposts_count ?? 0
      };
      const currentMetricValue = metricForTrigger(plug.trigger_type, currentlyKnownMetrics);
      
      // If below 60% of threshold, skip the API call
      if (currentMetricValue < plug.trigger_value * 0.6) {
        await admin
          .from("post_targets")
          .update({ last_polled_at: new Date().toISOString() })
          .eq("id", target.id);
        continue; 
      }

      try {
        let metrics = { likes: 0, comments: 0, reposts: 0 };
        let plugPostId = "";
        const finalPlugContent = appendUtm(trimmedPlugContent, plug.platform);

        if (plug.platform === "TWITTER") {
          const service = await TwitterService.fromEncrypted(connection.access_token);
          if (!target.platform_post_id) throw new Error("Missing platform_post_id");
          metrics = await service.getTweetMetrics(target.platform_post_id);
          if (metricForTrigger(plug.trigger_type, metrics) >= plug.trigger_value) {
            const response = await service.replyToTweet(target.platform_post_id, finalPlugContent);
            plugPostId = response.id;
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
        // post might be null if inner join failed but we are in logic consistent state due to join? 
        // Actually if inner join logic holds, post is defined. 
        if (post?.user_id) {
            await sendPlugFailureEmail(post.user_id, plug.platform, plug.plug_content, message);
        }
      }
    }

    return json({ polled: plugs.length, fired, failed });
  } catch (error) {
    return err(error instanceof Error ? error.message : "poll-engagement failed", 500);
  }
});
