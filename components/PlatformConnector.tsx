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
      color: "#1DA1F2",
      bgClass: "bg-[#E8F5FD]",
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
          <div key={row.key} className="rounded-xl border border-[#27272B] bg-[#131316] p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${row.bgClass}`}
                  style={{ color: row.color }}
                >
                  {row.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#EDEDEF]">
                    {row.label}
                  </p>
                  <div className="flex items-center gap-1">
                    <div
                      className={`h-2 w-2 rounded-full ${connected ? "bg-[#2B8A3E]" : "bg-[#ADB5BD]"
                        }`}
                    />
                    <p className="text-xs text-[#A1A1AA]">
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
                  className="inline-flex items-center gap-2 rounded-lg border border-[#3F3F46] bg-[#27272B] px-3 py-1.5 text-xs font-medium text-[#EDEDEF] hover:bg-[#3F3F46] transition-colors"
                >
                  <X size={14} />
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => connectOAuth("twitter")}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#EDEDEF] px-3 py-1.5 text-xs font-medium text-[#131316] hover:bg-[#D4D4D8] transition-colors"
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
