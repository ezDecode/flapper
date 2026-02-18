"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { C } from "@/lib/landing-data";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Ticket } from "lucide-react";

import { TwitterXIcon } from "./ui/icons";

interface AuthModalProps {
  tab: "login" | "register";
  onTabChange: (tab: "login" | "register") => void;
  onClose: () => void;
}

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };
const EASE_OUT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* ── Styled Input ──────────────────────────────────────── */

function AuthInput({
  id,
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  id: string;
  label: string;
  icon: typeof Mail;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium"
        style={{ color: C.textSoft }}
      >
        {label}
      </label>
      <div
        className="relative flex items-center rounded-xl border transition-all duration-200"
        style={{
          borderColor: focused ? C.accent : C.border,
          backgroundColor: C.surface,
        }}
      >
        <Icon
          className="absolute left-3.5 h-4 w-4 transition-colors duration-300 pointer-events-none"
          style={{ color: focused ? C.accent : C.textMuted }}
          strokeWidth={1.75}
        />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent pl-10 pr-4 py-2.5 text-[15px] font-normal outline-none placeholder:text-[hsla(240,16%,94%,0.2)]"
          style={{ color: C.text }}
        />
      </div>
    </div>
  );
}

/* ── Main Modal ────────────────────────────────────────── */

export default function AuthModal({ tab, onTabChange, onClose }: AuthModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

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

  const formTransition = { duration: 0.3, ease: EASE_OUT };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{
        zIndex: 100,
        background: "hsla(0 0% 0% / 0.7)",
        backdropFilter: "blur(24px) saturate(1.6)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl"
        style={{
          backgroundColor: C.bgAlt,
          boxShadow:
            "0 32px 80px -16px hsla(0 0% 0% / 0.6), 0 0 0 1px hsla(240 2% 22% / 0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={spring}
      >


        {/* Content */}
        <div className="p-5 md:p-6">
          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2
                className="text-xl font-semibold tracking-tight"
                style={{ color: C.text }}
              >
                {tab === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p
                className="mt-1 text-[13px]"
                style={{ color: C.textMuted }}
              >
                {tab === "login"
                  ? "Sign in to your Flapr account"
                  : "Start your free account today"}
              </p>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer hover:bg-white/[0.06]"
              style={{ color: C.textMuted }}
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          {/* Tab switcher */}
          <div
            className="relative mb-5 flex rounded-xl p-1"
            style={{ backgroundColor: C.surface }}
          >
            <motion.div
              layoutId="authTabIndicator"
              className="absolute inset-y-1 rounded-[10px]"
              style={{
                background: C.accentSoft,
                width: "calc(50% - 4px)",
                left: tab === "login" ? 4 : "calc(50%)",
              }}
              transition={spring}
            />
            <button
              type="button"
              onClick={() => onTabChange("login")}
              className="relative z-[1] flex-1 rounded-[10px] py-2.5 text-sm font-medium transition-colors duration-300 cursor-pointer"
              style={{ color: tab === "login" ? C.accent : C.textMuted }}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => onTabChange("register")}
              className="relative z-[1] flex-1 rounded-[10px] py-2.5 text-sm font-medium transition-colors duration-300 cursor-pointer"
              style={{ color: tab === "register" ? C.accent : C.textMuted }}
            >
              Register
            </button>
          </div>

          {/* OAuth */}
          <motion.button
            type="button"
            onClick={() => oauth("twitter")}
            whileHover={{}}
            whileTap={{}}
            transition={spring}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl h-[48px] px-4 text-sm font-medium transition-all duration-300 cursor-pointer"
            style={{
              backgroundColor: C.surface,
              color: C.text,
              border: `1px solid ${C.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.textMuted;
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.backgroundColor = C.surface;
            }}
          >
            <TwitterXIcon className="h-4 w-4" />
            Continue with Twitter
          </motion.button>

          {/* Divider */}
          <div className="my-4 flex items-center gap-4">
            <div className="h-px flex-1" style={{ background: C.border }} />
            <span
              className="text-[11px] font-medium tracking-wider uppercase"
              style={{ color: C.textMuted }}
            >
              or
            </span>
            <div className="h-px flex-1" style={{ background: C.border }} />
          </div>

          {/* ── FORM TRANSITIONS ── */}
          <AnimatePresence mode="wait">
            {tab === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -16, filter: "blur(2px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 16, filter: "blur(2px)" }}
                transition={formTransition}
              >
                <form onSubmit={signIn} className="flex flex-col gap-3">
                  <AuthInput
                    id="modal-login-email"
                    label="Email"
                    icon={Mail}
                    type="email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    placeholder="you@example.com"
                    autoFocus
                  />
                  <AuthInput
                    id="modal-login-password"
                    label="Password"
                    icon={Lock}
                    type="password"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    placeholder="••••••••"
                  />

                  <AnimatePresence>
                    {loginError && (
                      <motion.div
                        className="rounded-lg px-3.5 py-2.5 text-[13px] overflow-hidden"
                        style={{
                          color: "hsl(var(--destructive))",
                          backgroundColor: "hsla(3 100% 61% / 0.08)",
                          border: "1px solid hsla(3 100% 61% / 0.15)",
                        }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {loginError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loginLoading}
                    whileHover={{}}
                    whileTap={{}}
                    transition={spring}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl h-[48px] px-4 text-[15px] font-semibold transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                    style={{
                      backgroundColor: C.accent,
                      color: "hsl(var(--primary-foreground))",
                    }}
                  >
                    {loginLoading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Signing in…
                      </span>
                    ) : (
                      "Log in"
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {tab === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 16, filter: "blur(2px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -16, filter: "blur(2px)" }}
                transition={formTransition}
              >
                {regSuccess ? (
                  <motion.div
                    className="flex flex-col items-center gap-3 rounded-xl border px-5 py-8 text-center"
                    style={{
                      borderColor: `hsla(211 100% 52% / 0.2)`,
                      background: C.accentSoft,
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={spring}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full mb-1"
                      style={{ backgroundColor: C.accentSoft }}
                    >
                      <Mail
                        className="h-6 w-6"
                        style={{ color: C.accent }}
                        strokeWidth={1.75}
                      />
                    </div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: C.accent }}
                    >
                      {regSuccess}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={register} className="flex flex-col gap-3">
                    <AuthInput
                      id="modal-reg-name"
                      label="Full name"
                      icon={User}
                      value={name}
                      onChange={setName}
                      placeholder="Jane Doe"
                      autoFocus
                    />
                    <AuthInput
                      id="modal-reg-beta"
                      label="Invite code"
                      icon={Ticket}
                      value={betaCode}
                      onChange={async (code) => {
                        setBetaCode(code);
                        if (code.length > 5) {
                          const { data: isValid } = await (
                            supabase.rpc as Function
                          )("check_invite_code", { code_input: code });
                          if (!isValid) setRegError("Invalid invite code");
                          else setRegError("");
                        }
                      }}
                      placeholder="Enter invite code"
                    />
                    <AuthInput
                      id="modal-reg-email"
                      label="Email"
                      icon={Mail}
                      type="email"
                      value={regEmail}
                      onChange={setRegEmail}
                      placeholder="you@example.com"
                    />
                    <AuthInput
                      id="modal-reg-password"
                      label="Password"
                      icon={Lock}
                      type="password"
                      value={regPassword}
                      onChange={setRegPassword}
                      placeholder="••••••••"
                    />

                    <AnimatePresence>
                      {regError && (
                        <motion.div
                          className="rounded-lg px-3.5 py-2.5 text-[13px] overflow-hidden"
                          style={{
                            color: "hsl(var(--destructive))",
                            backgroundColor: "hsla(3 100% 61% / 0.08)",
                            border: "1px solid hsla(3 100% 61% / 0.15)",
                          }}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {regError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      disabled={regLoading}
                      whileHover={{}}
                      whileTap={{}}
                      transition={spring}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl h-[48px] px-4 text-[15px] font-semibold transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                      style={{
                        backgroundColor: C.accent,
                        color: "hsl(var(--primary-foreground))",
                      }}
                    >
                      {regLoading ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.7,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Creating account…
                        </span>
                      ) : (
                        "Create account"
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
