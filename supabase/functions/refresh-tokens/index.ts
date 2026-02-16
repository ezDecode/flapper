import { err, handleCors, json } from "../_shared/cors.ts";
import { tokenExpired } from "../_shared/email-templates.ts";
import { encrypt } from "../_shared/token-crypto.ts";
import { admin, isServiceRoleRequest } from "../_shared/supabase-admin.ts";
import { TwitterService } from "../_shared/twitter.ts";

async function sendExpiredNotice(userId: string, platform: "TWITTER") {
  const { data: user } = await admin.from("users").select("email").eq("id", userId).single();
  if (!user?.email) return;
  const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:3000";
  const email = tokenExpired(platform, `${siteUrl}/settings`);
  await fetch(`${Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")}/functions/v1/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
    },
    body: JSON.stringify({ to: user.email, ...email })
  });
}

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;
  if (!isServiceRoleRequest(req)) return err("Service role authorization required", 401);

  try {
    const twitterSoon = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min

    const { data: expiring, error: refreshError } = await admin
      .from("platform_connections")
      .select("id, user_id, platform, refresh_token")
      .eq("platform", "TWITTER") // Only query for TWITTER connections
      .eq("is_active", true)
      .lt("token_expires_at", twitterSoon);

    if (refreshError) return err(refreshError.message, 500);

    if (!expiring || expiring.length === 0) return json({ refreshed: 0, deactivated: 0 });

    let refreshed = 0;
    let deactivated = 0;

    for (const connection of expiring) {
      if (!connection.refresh_token) continue;

      try {
        // Since we are only querying for TWITTER connections, we can directly call TwitterService
        const refreshPayload = await TwitterService.refreshTokens(connection.refresh_token);

        await admin
          .from("platform_connections")
          .update({
            access_token: await encrypt(refreshPayload.access_token),
            refresh_token: refreshPayload.refresh_token ? await encrypt(refreshPayload.refresh_token) : connection.refresh_token,
            token_expires_at: refreshPayload.expires_in
              ? new Date(Date.now() + refreshPayload.expires_in * 1000).toISOString()
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("id", connection.id);

        refreshed += 1;
      } catch (_error) {
        deactivated += 1;
        await admin.from("platform_connections").update({ is_active: false }).eq("id", connection.id);
        await sendExpiredNotice(connection.user_id, connection.platform);
      }
    }

    return json({ refreshed, deactivated });
  } catch (error) {
    return err(error instanceof Error ? error.message : "refresh-tokens failed", 500);
  }
});
