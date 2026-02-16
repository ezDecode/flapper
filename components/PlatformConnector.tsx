"use client";

import { useEffect, useState } from "react";
import { Button, Card, Flex, Text } from "@maximeheckel/design-system";
import { Twitter, Linkedin, Globe, Check, X } from "lucide-react";
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

  const connectOAuth = async (provider: "twitter" | "linkedin_oidc") => {
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
                        className={`h-2 w-2 rounded-full ${connected ? "bg-[#2B8A3E]" : "bg-[#ADB5BD]"
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
                ) : (
                  <Button
                    variant="primary"
                    startIcon={<Check size={14} />}
                    onClick={() => connectOAuth("twitter")}
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
