"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { C } from "@/lib/landing-data";

import { TwitterXIcon } from "./ui/icons";

interface AuthModalProps {
  tab: "login" | "register";
  onTabChange: (tab: "login" | "register") => void;
  onClose: () => void;
}

export default function AuthModal({ tab, onTabChange, onClose }: AuthModalProps) {
  const router = useRouter();
  const supabase = createClient();

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

  const oauth = async (provider: "twitter") => {
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`;
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
    router.push("/dashboard");
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
    "w-full rounded-lg border px-3 py-2.5 text-sm font-normal outline-none transition-colors focus:border-[#00AA45]";
  const inputStyle = {
    background: C.surface,
    borderColor: C.border,
    color: C.text,
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{
        zIndex: 100,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        animation: "authModalFadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes authModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div
        className="relative w-full max-w-[420px] rounded-xl border p-8"
        style={{ background: C.bgAlt, borderColor: C.border, boxShadow: "0 20px 60px -15px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >


        {/* Tab switcher */}
        <div
          className="mb-6 flex rounded-full border p-1"
          style={{ borderColor: C.border, background: C.surface }}
        >
          <button
            type="button"
            onClick={() => onTabChange("login")}
            className="flex-1 rounded-full py-2 text-sm font-medium transition-all"
            style={{
              background: tab === "login" ? "#F0F0EC" : "transparent",
              color: tab === "login" ? C.text : C.textMuted,
            }}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => onTabChange("register")}
            className="flex-1 rounded-full py-2 text-sm font-medium transition-all"
            style={{
              background: tab === "register" ? "#F0F0EC" : "transparent",
              color: tab === "register" ? C.text : C.textMuted,
            }}
          >
            Register
          </button>
        </div>

        {/* OAuth buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => oauth("twitter")}
            className="inline-flex items-center justify-center gap-2 rounded-full w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90"
            style={{ backgroundColor: "#000000", color: "#ffffff", border: `1px solid ${C.border}` }}
          >
            <TwitterXIcon className="mr-2 h-5 w-5" />
            Sign in with Twitter
          </button>

        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: C.border }} />
          <span className="text-xs font-normal" style={{ color: C.textMuted }}>
            or sign in with email
          </span>
          <div className="h-px flex-1" style={{ background: C.border }} />
        </div>

        {/* ── LOGIN FORM ── */}
        {tab === "login" && (
          <form onSubmit={signIn} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="modal-login-email"
                className="mb-1.5 block text-xs font-medium"
                style={{ color: C.textSoft }}
              >
                Email
              </label>
              <input
                id="modal-login-email"
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
                htmlFor="modal-login-password"
                className="mb-1.5 block text-xs font-medium"
                style={{ color: C.textSoft }}
              >
                Password
              </label>
              <input
                id="modal-login-password"
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
              className="inline-flex items-center justify-center gap-2 rounded-full w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
              style={{ backgroundColor: C.accent, color: "#fff" }}
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
                style={{ borderColor: "#BBF7D0", background: "#ECFDF5" }}
              >
                <p className="text-sm font-normal" style={{ color: "#166534" }}>
                  {regSuccess}
                </p>
              </div>
            ) : (
              <form onSubmit={register} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="modal-reg-name"
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: C.textSoft }}
                  >
                    Full name
                  </label>
                  <input
                    id="modal-reg-name"
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
                    htmlFor="modal-reg-beta"
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: C.textSoft }}
                  >
                    Invite code
                  </label>
                  <input
                    id="modal-reg-beta"
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
                    htmlFor="modal-reg-email"
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: C.textSoft }}
                  >
                    Email
                  </label>
                  <input
                    id="modal-reg-email"
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
                    htmlFor="modal-reg-password"
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: C.textSoft }}
                  >
                    Password
                  </label>
                  <input
                    id="modal-reg-password"
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
                  className="inline-flex items-center justify-center gap-2 rounded-full w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                  style={{ backgroundColor: C.accent, color: "#fff" }}
                >
                  {regLoading ? "Creating your account…" : "Create account"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
