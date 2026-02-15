"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [nextPath, setNextPath] = useState("/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("next");
    if (value?.startsWith("/")) {
      setNextPath(value);
    }
  }, []);

  const oauth = async (provider: "twitter" | "linkedin_oidc") => {
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
  };

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  return (
    <section className="mx-auto max-w-md space-y-4 rounded-2xl border border-[var(--line)] bg-white p-6">
      <h1 className="text-2xl font-semibold">Log in</h1>

      <div className="space-y-2">
        <button
          type="button"
          className="w-full rounded border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          onClick={() => oauth("twitter")}
        >
          Continue with Twitter
        </button>
        <button
          type="button"
          className="w-full rounded border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          onClick={() => oauth("linkedin_oidc")}
        >
          Continue with LinkedIn
        </button>
      </div>

      <form className="space-y-3" onSubmit={signIn}>
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
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <p className="text-sm text-slate-600">
        Need an account?{" "}
        <Link href="/register" className="text-[var(--brand-dark)] underline">
          Register
        </Link>
      </p>
    </section>
  );
}
