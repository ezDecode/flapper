"use client";

import { useEffect, useState } from "react";
import { Twitter, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type PlatformConnection = {
  id: string;
  platform: "TWITTER";
  platform_handle: string;
  is_active: boolean;
};

const platformRows: Array<{
  key: "TWITTER";
  label: string;
  icon: React.ReactNode;
  color: string;
  bgClass: string;
}> = [
    {
      key: "TWITTER",
      label: "Twitter / X",
      icon: <Twitter size={18} />,
      color: "#FFFFFF",
      bgClass: "bg-white/10",
    }
  ];

export function PlatformConnector() {
  const supabase = createClient();
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


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

  const connectOAuth = async (provider: "twitter") => {
    const redirectTo = `${window.location.origin}/auth/callback?next=/settings`;
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
  };

  const disconnect = async (id: string) => {
    await supabase
      .from("platform_connections")
      .update({ is_active: false })
      .eq("id", id);
    await refresh();
  };

  return (
    <div className="flex flex-col gap-3">
      {platformRows.map((row) => {
        const connected = connections.find((item) => item.platform === row.key);

        return (
          <div key={row.key} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${row.bgClass}`}
                  style={{ color: row.color }}
                >
                  {row.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {row.label}
                  </p>
                  <div className="flex items-center gap-1">
                    <div
                      className={`h-2 w-2 rounded-full ${connected ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                    />
                    <p className="text-xs text-muted-foreground">
                      {connected
                        ? `Connected as @${connected.platform_handle}`
                        : "Not connected"}
                    </p>
                  </div>
                </div>
              </div>

              {connected ? (
                <button
                  onClick={() => disconnect(connected.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <X size={14} />
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => connectOAuth("twitter")}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Check size={14} />
                  Connect
                </button>
              )}
            </div>
          </div>
        );
      })}

      {message ? (
        <p className="text-sm text-[#A1A1AA]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
