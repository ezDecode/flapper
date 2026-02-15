"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [betaCode, setBetaCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const register = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, beta_code: betaCode.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`
      }
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    setLoading(false);
    setSuccess("Check your email to confirm your account.");
  };

  return (
    <section className="mx-auto max-w-md space-y-4 rounded-2xl border border-[var(--line)] bg-white p-6">
      <h1 className="text-2xl font-semibold">Create account</h1>

      <p className="text-sm text-slate-600">Invite-only signup. Use your invite code to create an account.</p>

      <form className="space-y-3" onSubmit={register}>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full name"
          required
        />
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          value={betaCode}
          onChange={(event) => setBetaCode(event.target.value)}
          placeholder="Enter invite code"
          required
        />
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[var(--brand)] px-4 py-2 text-white hover:bg-[var(--brand-dark)] disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-700">{success}</p> : null}

      <p className="text-sm text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="text-[var(--brand-dark)] underline">
          Login
        </Link>
      </p>
    </section>
  );
}
