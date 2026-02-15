"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, TextInput, Text, H2, Flex, Box } from "@maximeheckel/design-system";
import { AtSign, Linkedin } from "lucide-react";

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
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#FAFAF8" }}
    >
      <div className="w-full max-w-[420px]">
        <Flex direction="column" alignItems="center" gap="4">
          <Text
            size="3"
            weight="4"
            style={{ color: "#F76707", letterSpacing: "0.05em" }}
          >
            FLAPR
          </Text>

          <Card depth={1}>
            <Card.Body>
              <Flex direction="column" gap="6">
                <Box>
                  <H2 style={{ color: "#1A1A1A", marginBottom: "4px" }}>
                    Welcome back
                  </H2>
                  <Text size="1" style={{ color: "#6B6B6B" }}>
                    Sign in to your account to continue
                  </Text>
                </Box>

                <Flex direction="column" gap="3">
                  <Button
                    variant="secondary"
                    startIcon={<AtSign size={16} />}
                    onClick={() => oauth("twitter")}
                    style={{ width: "100%" }}
                  >
                    Continue with Twitter
                  </Button>
                  <Button
                    variant="secondary"
                    startIcon={<Linkedin size={16} />}
                    onClick={() => oauth("linkedin_oidc")}
                    style={{ width: "100%" }}
                  >
                    Continue with LinkedIn
                  </Button>
                </Flex>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E5E5E3]" />
                  <Text size="1" style={{ color: "#6B6B6B" }}>
                    or continue with email
                  </Text>
                  <div className="h-px flex-1 bg-[#E5E5E3]" />
                </div>

                <form onSubmit={signIn}>
                  <Flex direction="column" gap="4">
                    <TextInput
                      id="login-email"
                      aria-label="Email address"
                      type="email"
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                      placeholder="you@example.com"
                    />
                    <TextInput
                      id="login-password"
                      aria-label="Password"
                      type="password"
                      label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.currentTarget.value)}
                      placeholder="••••••••"
                    />

                    {error && (
                      <Text size="1" style={{ color: "#DC2626" }}>
                        {error}
                      </Text>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-60"
                      style={{
                        backgroundColor: loading ? "#F76707" : "#F76707",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading)
                          (e.currentTarget.style.backgroundColor = "#E8590C");
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#F76707";
                      }}
                    >
                      {loading ? "Logging in…" : "Log in"}
                    </button>
                  </Flex>
                </form>

                <Text size="1" style={{ color: "#6B6B6B", textAlign: "center" }}>
                  Need an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium underline"
                    style={{ color: "#E8590C" }}
                  >
                    Register
                  </Link>
                </Text>
              </Flex>
            </Card.Body>
          </Card>
        </Flex>
      </div>
    </div>
  );
}
