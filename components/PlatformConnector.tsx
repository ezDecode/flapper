"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PlatformConnection = {
  id: string;
  platform: "TWITTER" | "LINKEDIN" | "BLUESKY";
  platform_handle: string;
  is_active: boolean;
};

const platformRows: Array<{
  key: "TWITTER" | "LINKEDIN" | "BLUESKY";
  label: string;
}> = [
  { key: "TWITTER", label: "Twitter/X" },
  { key: "LINKEDIN", label: "LinkedIn" },
  { key: "BLUESKY", label: "Bluesky" }
];

export function PlatformConnector() {
  const supabase = createClient();
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [blueskyHandle, setBlueskyHandle] = useState("");
  const [blueskyPassword, setBlueskyPassword] = useState("");

  const refresh = async () => {
    const { data } = await supabase
      .from("platform_connections")
      .select("id, platform, platform_handle, is_active")
      .eq("is_active", true);
    setConnections((data as PlatformConnection[]) ?? []);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const connectOAuth = async (provider: "twitter" | "linkedin_oidc") => {
    const redirectTo = `${window.location.origin}/auth/callback?next=/settings`;
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
  };

  const connectBluesky = async () => {
    setLoading(true);
    setMessage("");
    const {
      data: { session }
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      setMessage("Please log in first.");
      setLoading(false);
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/platform-connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        platform: "BLUESKY",
        platform_user_id: blueskyHandle,
        platform_handle: blueskyHandle,
        access_token: blueskyPassword,
        bluesky_handle: blueskyHandle,
        bluesky_app_password: blueskyPassword
      })
    });

    if (!response.ok) {
      setMessage("Could not connect Bluesky.");
      setLoading(false);
      return;
    }

    setMessage("Bluesky connected.");
    setBlueskyHandle("");
    setBlueskyPassword("");
    await refresh();
    setLoading(false);
  };

  const disconnect = async (id: string) => {
    await supabase.from("platform_connections").update({ is_active: false }).eq("id", id);
    await refresh();
  };

  return (
    <div className="space-y-4">
      {platformRows.map((row) => {
        const connected = connections.find((item) => item.platform === row.key);

        return (
          <section key={row.key} className="rounded-xl border border-[var(--line)] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">{row.label}</h3>
                <p className="text-sm text-slate-600">
                  {connected ? `Connected as @${connected.platform_handle}` : "Not connected"}
                </p>
              </div>
              {connected ? (
                <button
                  type="button"
                  className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                  onClick={() => disconnect(connected.id)}
                >
                  Disconnect
                </button>
              ) : row.key === "TWITTER" ? (
                <button
                  type="button"
                  className="rounded bg-[var(--brand)] px-3 py-1.5 text-sm text-white hover:bg-[var(--brand-dark)]"
                  onClick={() => connectOAuth("twitter")}
                >
                  Connect OAuth
                </button>
              ) : row.key === "LINKEDIN" ? (
                <button
                  type="button"
                  className="rounded bg-[var(--brand)] px-3 py-1.5 text-sm text-white hover:bg-[var(--brand-dark)]"
                  onClick={() => connectOAuth("linkedin_oidc")}
                >
                  Connect OAuth
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={blueskyHandle}
                    onChange={(event) => setBlueskyHandle(event.target.value)}
                    className="rounded border border-slate-300 px-2 py-1 text-sm"
                    placeholder="handle.bsky.social"
                  />
                  <input
                    value={blueskyPassword}
                    onChange={(event) => setBlueskyPassword(event.target.value)}
                    className="rounded border border-slate-300 px-2 py-1 text-sm"
                    placeholder="App password"
                    type="password"
                  />
                  <button
                    type="button"
                    className="rounded bg-[var(--brand)] px-3 py-1.5 text-sm text-white hover:bg-[var(--brand-dark)] disabled:opacity-60"
                    onClick={connectBluesky}
                    disabled={loading || !blueskyHandle || !blueskyPassword}
                  >
                    Connect
                  </button>
                </div>
              )}
            </div>
          </section>
        );
      })}
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
