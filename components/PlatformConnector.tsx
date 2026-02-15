"use client";

import { useEffect, useState } from "react";
import { Button, Card, Flex, Text } from "@maximeheckel/design-system";
import { Twitter, Linkedin, Globe, Check, X } from "lucide-react";
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
  },
  {
    key: "LINKEDIN",
    label: "LinkedIn",
    icon: <Linkedin size={18} />,
    color: "#0A66C2",
    bgClass: "bg-[#E8F0FE]",
  },
  {
    key: "BLUESKY",
    label: "Bluesky",
    icon: <Globe size={18} />,
    color: "#0085FF",
    bgClass: "bg-[#E8F4FF]",
  },
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
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      setMessage("Please log in first.");
      setLoading(false);
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/platform-connect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          platform: "BLUESKY",
          platform_user_id: blueskyHandle,
          platform_handle: blueskyHandle,
          access_token: blueskyPassword,
          bluesky_handle: blueskyHandle,
          bluesky_app_password: blueskyPassword,
        }),
      }
    );

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
    await supabase
      .from("platform_connections")
      .update({ is_active: false })
      .eq("id", id);
    await refresh();
  };

  return (
    <Flex direction="column" gap="3">
      {platformRows.map((row) => {
        const connected = connections.find((item) => item.platform === row.key);

        return (
          <Card key={row.key}>
            <Card.Body>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                gap="4"
                wrap="wrap"
              >
                <Flex alignItems="center" gap="3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${row.bgClass}`}
                    style={{ color: row.color }}
                  >
                    {row.icon}
                  </div>
                  <div>
                    <Text size="2" weight="4">
                      {row.label}
                    </Text>
                    <Flex alignItems="center" gap="1">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          connected ? "bg-[#2B8A3E]" : "bg-[#ADB5BD]"
                        }`}
                      />
                      <Text size="1" variant="tertiary">
                        {connected
                          ? `Connected as @${connected.platform_handle}`
                          : "Not connected"}
                      </Text>
                    </Flex>
                  </div>
                </Flex>

                {connected ? (
                  <Button
                    variant="secondary"
                    startIcon={<X size={14} />}
                    onClick={() => disconnect(connected.id)}
                  >
                    Disconnect
                  </Button>
                ) : row.key === "BLUESKY" ? (
                  <Flex alignItems="center" gap="2" wrap="wrap">
                    <input
                      value={blueskyHandle}
                      onChange={(e) => setBlueskyHandle(e.target.value)}
                      className="h-8 rounded-lg border border-[#E8E8E4] bg-white px-3 text-sm placeholder:text-[#6B6B6B]/60 focus:border-[#F76707] focus:outline-none focus:ring-1 focus:ring-[#F76707]"
                      placeholder="handle.bsky.social"
                    />
                    <input
                      value={blueskyPassword}
                      onChange={(e) => setBlueskyPassword(e.target.value)}
                      className="h-8 rounded-lg border border-[#E8E8E4] bg-white px-3 text-sm placeholder:text-[#6B6B6B]/60 focus:border-[#F76707] focus:outline-none focus:ring-1 focus:ring-[#F76707]"
                      placeholder="App password"
                      type="password"
                    />
                    <Button
                      variant="primary"
                      startIcon={<Check size={14} />}
                      onClick={connectBluesky}
                      disabled={loading || !blueskyHandle || !blueskyPassword}
                    >
                      Connect
                    </Button>
                  </Flex>
                ) : (
                  <Button
                    variant="primary"
                    startIcon={<Check size={14} />}
                    onClick={() =>
                      connectOAuth(
                        row.key === "TWITTER" ? "twitter" : "linkedin_oidc"
                      )
                    }
                  >
                    Connect
                  </Button>
                )}
              </Flex>
            </Card.Body>
          </Card>
        );
      })}

      {message ? (
        <Text size="2" variant="tertiary">
          {message}
        </Text>
      ) : null}
    </Flex>
  );
}
