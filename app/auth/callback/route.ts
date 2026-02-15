import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type OAuthSession = {
  provider_token?: string | null;
  provider_refresh_token?: string | null;
};

const providerMap: Record<string, "TWITTER" | "LINKEDIN" | null> = {
  twitter: "TWITTER",
  linkedin_oidc: "LINKEDIN"
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = createClient();
  const exchange = await supabase.auth.exchangeCodeForSession(code);

  if (exchange.error) {
    return NextResponse.redirect(`${origin}/login?error=oauth_exchange_failed`);
  }

  const {
    data: { session }
  } = await supabase.auth.getSession();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const oauthSession = session as OAuthSession | null;
  const provider = user?.app_metadata?.provider as string | undefined;
  const platform = provider ? providerMap[provider] : null;

  if (oauthSession?.provider_token && platform && session?.access_token) {
    const payload = {
      platform,
      access_token: oauthSession.provider_token,
      refresh_token: oauthSession.provider_refresh_token ?? undefined,
      platform_user_id: user?.id ?? "",
      platform_handle: user?.user_metadata?.user_name ?? user?.email ?? ""
    };

    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/platform-connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(payload)
    });
  }

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=missing_user`);
  }

  const { data: profileRaw } = await supabase.from("users").select("onboarding_step").eq("id", user.id).single();
  const profile = profileRaw as { onboarding_step: number } | null;
  const onboardingStep = profile?.onboarding_step ?? 0;

  if (onboardingStep < 3) {
    return NextResponse.redirect(`${origin}/onboarding`);
  }

  const fallback = next?.startsWith("/") ? next : "/dashboard";
  return NextResponse.redirect(`${origin}${fallback}`);
}
