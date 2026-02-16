import { encrypt } from "../_shared/token-crypto.ts";
import { admin, getUserFromRequest } from "../_shared/supabase-admin.ts";
import { err, handleCors, json } from "../_shared/cors.ts";

type Platform = "TWITTER";

type Payload = {
  platform: Platform;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  platform_user_id?: string;
  platform_handle?: string;
  code_verifier?: string;
  redirect_uri?: string;
  scopes?: string[];
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

    if (body.platform !== "TWITTER") {
      return err("Only Twitter is supported at this time", 400);
    }

    const platform = body.platform;
    const accessToken = body.access_token ?? "";
    const refreshToken = body.refresh_token ?? null;
    const platformHandle = body.platform_handle;

    if (!accessToken || !platformHandle) {
      return err("Missing access token or platform handle");
    }

    const encryptedAccess = await encrypt(accessToken);
    const encryptedRefresh = refreshToken ? await encrypt(refreshToken) : null;
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
