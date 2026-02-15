"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, TextInput, Text, H2, Flex, Box } from "@maximeheckel/design-system";
import { AtSign, Linkedin, Key } from "lucide-react";

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
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
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
                    Create account
                  </H2>
                  <Text size="1" style={{ color: "#6B6B6B" }}>
                    Invite-only beta — enter your code to get started
                  </Text>
                </Box>

                {success ? (
                  <div
                    className="rounded-lg border px-4 py-3"
                    style={{
                      borderColor: "#BBF7D0",
                      backgroundColor: "#F0FDF4",
                    }}
                  >
                    <Text size="1" style={{ color: "#166534" }}>
                      {success}
                    </Text>
                  </div>
                ) : (
                  <>
                    <form onSubmit={register}>
                      <Flex direction="column" gap="4">
                        <TextInput
                          id="register-name"
                          aria-label="Full name"
                          type="text"
                          label="Full name"
                          value={name}
                          onChange={(e) => setName(e.currentTarget.value)}
                          placeholder="Jane Doe"
                        />
                        <TextInput
                          id="register-beta-code"
                          aria-label="Invite code"
                          type="text"
                          label="Invite code"
                          value={betaCode}
                          onChange={async (e) => {
                            const code = e.currentTarget.value;
                            setBetaCode(code);
                            if (code.length > 5) {
                              const { data: isValid } = await (supabase.rpc as Function)(
                                "check_invite_code",
                                { code_input: code }
                              );
                              if (!isValid) setError("Invalid invite code");
                              else setError("");
                            }
                          }}
                          placeholder="Enter invite code"
                        />
                        <TextInput
                          id="register-email"
                          aria-label="Email address"
                          type="email"
                          label="Email"
                          value={email}
                          onChange={(e) => setEmail(e.currentTarget.value)}
                          placeholder="you@example.com"
                        />
                        <TextInput
                          id="register-password"
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
                          style={{ backgroundColor: "#F76707" }}
                          onMouseEnter={(e) => {
                            if (!loading)
                              (e.currentTarget.style.backgroundColor =
                                "#E8590C");
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#F76707";
                          }}
                        >
                          {loading ? "Creating account…" : "Create account"}
                        </button>
                      </Flex>
                    </form>
                  </>
                )}

                <Text
                  size="1"
                  style={{ color: "#6B6B6B", textAlign: "center" }}
                >
                  Already registered?{" "}
                  <Link
                    href="/login"
                    className="font-medium underline"
                    style={{ color: "#E8590C" }}
                  >
                    Log in
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
