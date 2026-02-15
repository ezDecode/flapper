import { encrypt } from "../_shared/token-crypto.ts";
import { admin, getUserFromRequest } from "../_shared/supabase-admin.ts";
import { err, handleCors, json } from "../_shared/cors.ts";

type Platform = "TWITTER" | "LINKEDIN" | "BLUESKY";

type Payload = {
  platform: Platform;
  access_token?: string;
  refresh_token?: string;
  platform_user_id?: string;
  platform_handle?: string;
  expires_in?: number;
  scopes?: string[];
  bluesky_handle?: string;
  bluesky_app_password?: string;
};

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  try {
    const user = await getUserFromRequest(req);
    const body = (await req.json()) as Payload;

    if (!body.platform) {
      return err("platform is required");
    }

    const platform = body.platform;
    const rawAccessToken =
      platform === "BLUESKY" ? body.bluesky_app_password ?? body.access_token ?? "" : body.access_token ?? "";
    const rawRefreshToken = body.refresh_token ?? null;
    const platformHandle = platform === "BLUESKY" ? body.bluesky_handle ?? body.platform_handle : body.platform_handle;

    if (!rawAccessToken || !platformHandle) {
      return err("Missing access token or platform handle");
    }

    const encryptedAccess = await encrypt(rawAccessToken);
    const encryptedRefresh = rawRefreshToken ? await encrypt(rawRefreshToken) : null;
    const tokenExpiresAt = body.expires_in ? new Date(Date.now() + body.expires_in * 1000).toISOString() : null;

    const { error: upsertError } = await admin.from("platform_connections").upsert(
      {
        user_id: user.id,
        platform,
        platform_user_id: body.platform_user_id ?? user.id,
        platform_handle: platformHandle,
        access_token: encryptedAccess,
        refresh_token: encryptedRefresh,
        token_expires_at: tokenExpiresAt,
        scopes: body.scopes ?? [],
        is_active: true,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id,platform" }
    );

    if (upsertError) {
      return err(`Failed to store platform connection: ${upsertError.message}`);
    }

    const { data: profile } = await admin.from("users").select("onboarding_step").eq("id", user.id).single();
    if ((profile?.onboarding_step ?? 0) < 1) {
      await admin.from("users").update({ onboarding_step: 1 }).eq("id", user.id);
    }

    return json({ success: true, platform, handle: platformHandle });
  } catch (error) {
    return err(error instanceof Error ? error.message : "Platform connect failed", 401);
  }
});
