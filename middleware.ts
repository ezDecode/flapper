import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedPaths = ["/dashboard", "/compose", "/schedule", "/analytics", "/settings", "/onboarding"];
const authPages = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const needsAuth = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isAuthPage = authPages.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (!user && needsAuth) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && needsAuth && !pathname.startsWith("/onboarding")) {
    const { data: profile } = await supabase
      .from("users")
      .select("onboarding_step")
      .eq("id", user.id)
      .single();

    if ((profile?.onboarding_step ?? 0) < 3) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/onboarding";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (user && isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
