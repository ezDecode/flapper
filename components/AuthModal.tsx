"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { C } from "@/lib/landing-data";
import { motion, AnimatePresence } from "motion/react";

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
    `w-full rounded-lg border px-3 py-2.5 text-sm font-normal outline-none transition-colors focus:border-[${C.accent}]`;
  const inputStyle = {
    background: C.surface,
    borderColor: C.border,
    color: C.text,
  };

  const formTransition = { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{
        zIndex: 100,
        background: "hsl(var(--background) / 0.8)",
        backdropFilter: "blur(8px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-[420px] rounded-xl border p-8"
        style={{ background: C.bgAlt, borderColor: C.border, boxShadow: "0 20px 60px -15px hsl(var(--background) / 0.5)" }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >


        {/* Tab switcher */}
        <div
          className="relative mb-6 flex rounded-full border p-1"
          style={{ borderColor: C.border, background: C.surface }}
        >
          <motion.div
            layoutId="authTabIndicator"
            className="absolute inset-y-1 rounded-full"
            style={{
              background: C.accentSoft,
              width: "calc(50% - 4px)",
              left: tab === "login" ? 4 : "calc(50%)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          <button
            type="button"
            onClick={() => onTabChange("login")}
            className="relative z-[1] flex-1 rounded-full py-2 text-sm font-medium transition-colors"
            style={{
              color: tab === "login" ? C.accent : C.textMuted,
            }}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => onTabChange("register")}
            className="relative z-[1] flex-1 rounded-full py-2 text-sm font-medium transition-colors"
            style={{
              color: tab === "register" ? C.accent : C.textMuted,
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
            style={{ backgroundColor: C.surface, color: C.text, border: `1px solid ${C.border}` }}
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

        {/* ── FORM TRANSITIONS ── */}
        <AnimatePresence mode="wait">
          {tab === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={formTransition}
            >
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

                <AnimatePresence>
                  {loginError && (
                    <motion.p
                      className="text-xs font-normal overflow-hidden"
                      style={{ color: "hsl(var(--destructive))" }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {loginError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-full w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                  style={{ backgroundColor: C.accent, color: "hsl(var(--primary-foreground))" }}
                >
                  {loginLoading ? "Logging in…" : "Log in"}
                </button>
              </form>
            </motion.div>
          )}

          {tab === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={formTransition}
            >
              {regSuccess ? (
                <motion.div
                  className="rounded-lg border px-4 py-3"
                  style={{ borderColor: `${C.accent}40`, background: C.accentSoft }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <p className="text-sm font-normal" style={{ color: C.accent }}>
                    {regSuccess}
                  </p>
                </motion.div>
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

                  <AnimatePresence>
                    {regError && (
                      <motion.p
                        className="text-xs font-normal overflow-hidden"
                        style={{ color: "hsl(var(--destructive))" }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {regError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-full w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                    style={{ backgroundColor: C.accent, color: "hsl(var(--primary-foreground))" }}
                  >
                    {regLoading ? "Creating your account…" : "Create account"}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
