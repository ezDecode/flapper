"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { TwitterXIcon, LinkedInIcon } from "@/components/ui/icons";

export default function AuthPageWrapper() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
}

function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [nextPath, setNextPath] = useState("/dashboard");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register state
  const [name, setName] = useState("");
  const [betaCode, setBetaCode] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  useEffect(() => {
    const value = searchParams.get("next");
    if (value?.startsWith("/")) setNextPath(value);
  }, [searchParams]);

  const oauth = async (provider: "twitter" | "linkedin_oidc") => {
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
  };

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoginLoading(false);
    if (error) {
      setLoginError(error.message);
      return;
    }
    router.push(nextPath);
    router.refresh();
  };

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    setRegLoading(true);
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        data: { full_name: name, beta_code: betaCode.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });
    setRegLoading(false);
    if (error) {
      setRegError(error.message);
      return;
    }
    setRegSuccess("Check your email to confirm your account.");
  };

  const inputClass =
    "w-full rounded-lg border px-3 py-2.5 text-sm font-normal outline-none transition-colors focus:border-[#8B5CF6]";
  const inputStyle = {
    background: "#FAF8F5",
    borderColor: "#E5E0D8",
    color: "#1A1A2E",
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "#FAF8F5" }}
    >
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-lg font-medium tracking-tight"
            style={{ color: "#8B5CF6" }}
          >
            Flapr
          </Link>
        </div>

        <div
          className="rounded-xl border p-8"
          style={{ background: "#F2EFE9", borderColor: "#E5E0D8" }}
        >
          {/* Tab switcher */}
          <div
            className="mb-6 flex rounded-lg border p-1"
            style={{ borderColor: "#E5E0D8", background: "#FAF8F5" }}
          >
            <button
              type="button"
              onClick={() => setTab("login")}
              className="flex-1 rounded-md py-2 text-sm font-medium transition-all"
              style={{
                background: tab === "login" ? "#E5E0D8" : "transparent",
                color: tab === "login" ? "#1A1A2E" : "#6B6B7B",
              }}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className="flex-1 rounded-md py-2 text-sm font-medium transition-all"
              style={{
                background: tab === "register" ? "#E5E0D8" : "transparent",
                color: tab === "register" ? "#1A1A2E" : "#6B6B7B",
              }}
            >
              Register
            </button>
          </div>

          {/* OAuth buttons — shared */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => oauth("twitter")}
              className="inline-flex items-center justify-center gap-2 rounded-xl w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90"
              style={{ backgroundColor: "#000000", color: "#ffffff" }}
            >
              <TwitterXIcon className="mr-2 h-5 w-5" />
              Sign in with Twitter
            </button>
            <button
              type="button"
              onClick={() => oauth("linkedin_oidc")}
              className="inline-flex items-center justify-center gap-2 rounded-xl w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90"
              style={{ backgroundColor: "#0077B5", color: "#ffffff" }}
            >
              <LinkedInIcon className="mr-2 h-5 w-5" />
              Sign in with LinkedIn
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: "#E5E0D8" }} />
            <span className="text-xs font-normal" style={{ color: "#6B6B7B" }}>
              or sign in with email
            </span>
            <div className="h-px flex-1" style={{ background: "#E5E0D8" }} />
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === "login" && (
            <form onSubmit={signIn} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-xs font-medium"
                  style={{ color: "#6B6B7B" }}
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-xs font-medium"
                  style={{ color: "#6B6B7B" }}
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {loginError && (
                <p className="text-xs font-normal" style={{ color: "#EF4444" }}>
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
              >
                {loginLoading ? "Logging in…" : "Log in"}
              </button>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === "register" && (
            <>
              {regSuccess ? (
                <div
                  className="rounded-lg border px-4 py-3"
                  style={{ borderColor: "#1A4A2E", background: "#0D2818" }}
                >
                  <p className="text-sm font-normal" style={{ color: "#4ADE80" }}>
                    {regSuccess}
                  </p>
                </div>
              ) : (
                <form onSubmit={register} className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="reg-name"
                      className="mb-1.5 block text-xs font-medium"
                      style={{ color: "#6B6B7B" }}
                    >
                      Full name
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reg-beta"
                      className="mb-1.5 block text-xs font-medium"
                      style={{ color: "#6B6B7B" }}
                    >
                      Invite code
                    </label>
                    <input
                      id="reg-beta"
                      type="text"
                      value={betaCode}
                      onChange={async (e) => {
                        const code = e.target.value;
                        setBetaCode(code);
                        if (code.length > 5) {
                          const { data: isValid } = await (supabase.rpc as Function)(
                            "check_invite_code",
                            { code_input: code }
                          );
                          if (!isValid) setRegError("Invalid invite code");
                          else setRegError("");
                        }
                      }}
                      placeholder="Enter invite code"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reg-email"
                      className="mb-1.5 block text-xs font-medium"
                      style={{ color: "#6B6B7B" }}
                    >
                      Email
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="mb-1.5 block text-xs font-medium"
                      style={{ color: "#6B6B7B" }}
                    >
                      Password
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>

                  {regError && (
                    <p className="text-xs font-normal" style={{ color: "#EF4444" }}>
                      {regError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                    style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
                  >
                    {regLoading ? "Creating your account…" : "Create account"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
