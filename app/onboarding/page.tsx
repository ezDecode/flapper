"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// Actually better to just remove the import as we will use native elements per my discovery
// import { Button, Card, Flex, H1, H2, Pill, Text } from "@maximeheckel/design-system"; -> REMOVE
import {
  Twitter,
  Globe,
  Send,
  Zap,
  Check,
  ChevronDown,
  Heart,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Platform } from "@/lib/constants";


const platformOptions: Platform[] = ["TWITTER"];

const platformMeta: Record<
  Platform,
  { icon: React.ReactNode; label: string; color: string; bgClass: string }
> = {
  TWITTER: {
    icon: <Twitter size={18} />,
    label: "Twitter / X",
    color: "#1DA1F2",
    bgClass: "bg-[#E8F5FD]",
  },
};

const steps = [
  { number: 1, label: "Connect Accounts", icon: <Globe size={16} /> },
  { number: 2, label: "Draft First Post", icon: <Send size={16} /> },
  { number: 3, label: "Set Auto-Plug", icon: <Zap size={16} /> },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [connections, setConnections] = useState<
    Array<{ platform: Platform }>
  >([]);
  const [firstPostId, setFirstPostId] = useState<string>("");
  const [message, setMessage] = useState("");

  const [postContent, setPostContent] = useState("");
  const [postPlatform, setPostPlatform] = useState<Platform>("TWITTER");
  const [postSchedule, setPostSchedule] = useState("");
  const [plugValue, setPlugValue] = useState(100);
  const [plugContent, setPlugContent] = useState("");

  const progress = useMemo(() => `${currentStep} / 3`, [currentStep]);

  const refreshConnections = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("platform_connections")
      .select("platform")
      .eq("user_id", userId)
      .eq("is_active", true);
    setConnections(
      ((data ?? []) as Array<{ platform: Platform }>) ?? []
    );
  };

  const updateStep = async (nextStep: number) => {
    if (!userId) return;
    await supabase
      .from("users")
      .update({ onboarding_step: nextStep })
      .eq("id", userId);
    setCurrentStep(nextStep + 1);
  };

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("users")
        .select("onboarding_step")
        .eq("id", user.id)
        .single();
      const step = profile?.onboarding_step ?? 0;
      if (step >= 3) {
        router.push("/dashboard");
        return;
      }
      setCurrentStep(Math.min(step + 1, 3));

      const { data: posts } = await supabase
        .from("posts")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (posts?.[0]?.id) {
        setFirstPostId(posts[0].id);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    void refreshConnections();
  }, [userId]);

  const connectOAuth = async (provider: "twitter" | "linkedin_oidc") => {
    const redirectTo = `${window.location.origin}/auth/callback?next=/onboarding`;
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
  };



  const submitStep2 = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) return;

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        content: postContent,
        status: "SCHEDULED",
        scheduled_at: postSchedule
          ? new Date(postSchedule).toISOString()
          : null,
      })
      .select("id")
      .single();

    if (error || !post) {
      setMessage("Could not create first post.");
      return;
    }

    await supabase.from("post_targets").insert({
      post_id: post.id,
      platform: postPlatform,
    });

    setFirstPostId(post.id);
    await updateStep(2);
    setMessage("");
  };

  const submitStep3 = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firstPostId) {
      setMessage("Create a post first.");
      return;
    }

    await supabase.from("auto_plugs").insert({
      post_id: firstPostId,
      platform: postPlatform,
      plug_content: plugContent,
      trigger_type: "LIKES",
      trigger_value: plugValue,
    });

    await updateStep(3);
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto min-h-screen bg-[#FAFAF8] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-[#7C3AED]" />
            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E]">Welcome to Flapr</h1>
          </div>
          <p className="text-sm text-[#6B6B7B]">
            Let's get you set up in 3 quick steps.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-center gap-0">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center gap-0">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all ${currentStep > step.number
                    ? "border-[#2B8A3E] bg-[#2B8A3E] text-white"
                    : currentStep === step.number
                      ? "border-[#7C3AED] bg-[#F0ECFE] text-[#8B5CF6]"
                      : "border-[#E8E8E4] bg-white text-[#6B6B6B]"
                    }`}
                >
                  {currentStep > step.number ? (
                    <Check size={18} />
                  ) : (
                    step.number
                  )}
                </div>
                <p
                  className={`text-xs ${currentStep === step.number ? "font-semibold text-[#1A1A2E]" : "font-normal text-[#6B6B7B]"}`}
                >
                  {step.label}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`mx-3 mb-5 h-0.5 w-16 rounded-full ${currentStep > step.number
                    ? "bg-[#2B8A3E]"
                    : "bg-[#E8E8E4]"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Connect Platform */}
        {currentStep <= 1 && (
          <div className="rounded-2xl border border-[#E5E0D8] bg-white shadow-sm">
            <div className="border-b border-[#E5E0D8] px-6 py-4">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-[#7C3AED]" />
                <h2 className="text-xl font-semibold text-[#1A1A2E]">Connect Your Accounts</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-[#6B6B7B]">
                  Connect your social accounts so Flapr can publish posts and
                  fire auto-plugs on your behalf.
                </p>

                <div className="flex flex-col gap-3">
                  {platformOptions.map((platform) => {
                    const meta = platformMeta[platform];
                    const isConnected = connections.some(
                      (c) => c.platform === platform
                    );

                    return (
                      <div
                        key={platform}
                        className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${isConnected
                          ? "border-[#2B8A3E]/30 bg-[#EBFBEE]"
                          : "border-[#E8E8E4] bg-white"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.bgClass}`}
                            style={{ color: meta.color }}
                          >
                            {meta.icon}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1A1A2E]">
                              {meta.label}
                            </p>
                            {isConnected && (
                              <div className="flex items-center gap-1">
                                <Check
                                  size={12}
                                  className="text-[#2B8A3E]"
                                />
                                <p className="text-xs text-[#2B8A3E]">
                                  Connected
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {!isConnected && (
                          <button
                            type="button"
                            onClick={() => connectOAuth("twitter")}
                            className="inline-flex items-center justify-center rounded-lg border border-[#E8E8E4] bg-white px-3 py-1.5 text-xs font-medium text-[#1A1A2E] hover:bg-[#FAFAF8]"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  disabled={connections.length < 1}
                  onClick={() => updateStep(1)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                  style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
                >
                  Continue
                  <ChevronDown size={16} className="rotate-[-90deg]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Write First Post */}
        {currentStep === 2 && (
          <div className="rounded-2xl border border-[#E5E0D8] bg-white shadow-sm">
            <div className="border-b border-[#E5E0D8] px-6 py-4">
              <div className="flex items-center gap-2">
                <Send size={18} className="text-[#7C3AED]" />
                <h2 className="text-xl font-semibold text-[#1A1A2E]">Draft Your First Post</h2>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={submitStep2}>
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-[#6B6B7B]">
                    Draft a quick post — you can always edit it later in the
                    composer.
                  </p>

                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={5}
                    required
                    placeholder="What's on your mind?"
                    className="w-full rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] px-4 py-3 text-sm placeholder:text-[#6B6B6B]/60 focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                  />

                  <div className="flex gap-3 flex-wrap items-end">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-[#6B6B6B]">
                        Platform
                      </label>
                      <div className="flex gap-2">
                        {platformOptions.map((platform) => {
                          const meta = platformMeta[platform];
                          return (
                            <button
                              key={platform}
                              type="button"
                              onClick={() => setPostPlatform(platform)}
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${postPlatform === platform
                                ? "border-[#7C3AED] bg-[#F0ECFE] text-[#8B5CF6]"
                                : "border-[#E8E8E4] bg-white text-[#6B6B6B] hover:border-[#7C3AED]/40"
                                }`}
                            >
                              <span
                                style={{
                                  color:
                                    postPlatform === platform
                                      ? meta.color
                                      : undefined,
                                }}
                              >
                                {meta.icon}
                              </span>
                              {meta.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-[#6B6B6B]">
                        Schedule (optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={postSchedule}
                        onChange={(e) => setPostSchedule(e.target.value)}
                        className="h-8 rounded-lg border border-[#E8E8E4] bg-white px-3 text-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90"
                    style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
                  >
                    Save and continue
                    <ChevronDown size={16} className="rotate-[-90deg]" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Auto-Plug */}
        {currentStep >= 3 && (
          <div className="rounded-2xl border border-[#E5E0D8] bg-white shadow-sm">
            <div className="border-b border-[#E5E0D8] px-6 py-4">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#7C3AED]" />
                <h2 className="text-xl font-semibold text-[#1A1A2E]">Set Up Auto-Plug</h2>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={submitStep3}>
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-[#6B6B7B]">
                    Set a threshold — when your post hits that many likes, Flapr
                    automatically replies with your plug content.
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Heart size={14} className="text-[#7C3AED]" />
                      <label className="text-xs font-medium text-[#6B6B6B]">
                        Fire when likes reach
                      </label>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={plugValue}
                      onChange={(e) => setPlugValue(Number(e.target.value))}
                      className="h-9 w-32 rounded-lg border border-[#E8E8E4] bg-white px-3 text-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#6B6B6B]">
                      Auto-reply content
                    </label>
                    <textarea
                      value={plugContent}
                      onChange={(e) => setPlugContent(e.target.value)}
                      rows={4}
                      required
                      placeholder="When this post hits the threshold, reply with…"
                      className="w-full rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] px-4 py-3 text-sm placeholder:text-[#6B6B6B]/60 focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl w-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90"
                    style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
                  >
                    <Sparkles size={16} />
                    Finish onboarding
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Message */}
        {message ? (
          <div className="mt-4">
            <p className="text-sm text-[#6B6B7B]">
              {message}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
