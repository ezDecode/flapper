"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Platform } from "@/lib/constants";

const platformOptions: Platform[] = ["TWITTER", "LINKEDIN", "BLUESKY"];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [connections, setConnections] = useState<Array<{ platform: Platform }>>([]);
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
    const { data } = await supabase.from("platform_connections").select("platform").eq("user_id", userId).eq("is_active", true);
    setConnections(((data ?? []) as Array<{ platform: Platform }>) ?? []);
  };

  const updateStep = async (nextStep: number) => {
    if (!userId) return;
    await supabase.from("users").update({ onboarding_step: nextStep }).eq("id", userId);
    setCurrentStep(nextStep + 1);
  };

  useEffect(() => {
    const load = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const { data: profile } = await supabase.from("users").select("onboarding_step").eq("id", user.id).single();
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
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
  };

  const connectBluesky = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setMessage("Login required.");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/platform-connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({
        platform: "BLUESKY",
        access_token: "manual",
        platform_user_id: "bluesky",
        platform_handle: "bluesky"
      })
    });

    if (!response.ok) {
      setMessage("Could not connect Bluesky.");
      return;
    }

    await refreshConnections();
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
        scheduled_at: postSchedule ? new Date(postSchedule).toISOString() : null
      })
      .select("id")
      .single();

    if (error || !post) {
      setMessage("Could not create first post.");
      return;
    }

    await supabase.from("post_targets").insert({
      post_id: post.id,
      platform: postPlatform
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
      trigger_value: plugValue
    });

    await updateStep(3);
    router.push("/dashboard");
  };

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-[var(--line)] bg-white p-6">
      <header className="mb-5">
        <p className="text-sm text-slate-600">Step {progress}</p>
        <h1 className="text-2xl font-semibold">Onboarding</h1>
      </header>

      {currentStep <= 1 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Step 1: Connect at least one platform</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => connectOAuth("twitter")}
            >
              Connect Twitter
            </button>
            <button
              type="button"
              className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => connectOAuth("linkedin_oidc")}
            >
              Connect LinkedIn
            </button>
            <button type="button" className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50" onClick={connectBluesky}>
              Connect Bluesky
            </button>
          </div>
          <p className="text-sm text-slate-600">Connected: {connections.map((item) => item.platform).join(", ") || "None"}</p>
          <button
            type="button"
            disabled={connections.length < 1}
            className="rounded bg-[var(--brand)] px-4 py-2 text-sm text-white hover:bg-[var(--brand-dark)] disabled:opacity-50"
            onClick={() => updateStep(1)}
          >
            Continue
          </button>
        </section>
      ) : null}

      {currentStep === 2 ? (
        <form className="space-y-3" onSubmit={submitStep2}>
          <h2 className="text-lg font-semibold">Step 2: Write your first post</h2>
          <textarea
            value={postContent}
            onChange={(event) => setPostContent(event.target.value)}
            rows={5}
            required
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Write your post..."
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={postPlatform}
              onChange={(event) => setPostPlatform(event.target.value as Platform)}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={postSchedule}
              onChange={(event) => setPostSchedule(event.target.value)}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="rounded bg-[var(--brand)] px-4 py-2 text-sm text-white hover:bg-[var(--brand-dark)]">
            Save and continue
          </button>
        </form>
      ) : null}

      {currentStep >= 3 ? (
        <form className="space-y-3" onSubmit={submitStep3}>
          <h2 className="text-lg font-semibold">Step 3: Configure your first auto-plug</h2>
          <label className="block text-sm">
            Trigger likes
            <input
              type="number"
              min={1}
              value={plugValue}
              onChange={(event) => setPlugValue(Number(event.target.value))}
              className="mt-1 w-28 rounded border border-slate-300 px-3 py-2"
            />
          </label>
          <textarea
            value={plugContent}
            onChange={(event) => setPlugContent(event.target.value)}
            rows={4}
            required
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="When this post hits the threshold, reply with..."
          />
          <button type="submit" className="rounded bg-[var(--brand)] px-4 py-2 text-sm text-white hover:bg-[var(--brand-dark)]">
            Finish onboarding
          </button>
        </form>
      ) : null}

      {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
    </section>
  );
}
