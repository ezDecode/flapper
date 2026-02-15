"use client";

import { useMemo, useState } from "react";
import CharacterCount from "@tiptap/extension-character-count";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { addMinutes } from "date-fns";
import { AutoPlugConfig, type AutoPlugState } from "@/components/AutoPlugConfig";
import { PostPreview } from "@/components/PostPreview";
import { UpgradeModal } from "@/components/UpgradeModal";
import { PLATFORM_CHAR_LIMITS, type Platform } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const platforms = Object.keys(PLATFORM_CHAR_LIMITS) as Platform[];

const defaultAutoPlug: AutoPlugState = {
  TWITTER: { triggerType: "LIKES", triggerValue: 100, plugContent: "" },
  LINKEDIN: { triggerType: "LIKES", triggerValue: 100, plugContent: "" },
  BLUESKY: { triggerType: "LIKES", triggerValue: 100, plugContent: "" }
};

export function PostComposer() {
  const supabase = createClient();
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["TWITTER"]);
  const [autoPlugState, setAutoPlugState] = useState<AutoPlugState>(defaultAutoPlug);
  const [scheduledAt, setScheduledAt] = useState(addMinutes(new Date(), 15).toISOString().slice(0, 16));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit: 3000 })],
    content: ""
  });

  const content = editor?.getText() ?? "";

  const minRemaining = useMemo(() => {
    if (selectedPlatforms.length === 0) {
      return 0;
    }
    return Math.min(...selectedPlatforms.map((platform) => PLATFORM_CHAR_LIMITS[platform] - content.length));
  }, [content.length, selectedPlatforms]);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((item) => item !== platform) : [...prev, platform]));
  };

  const submit = async () => {
    if (!editor) {
      return;
    }
    if (selectedPlatforms.length === 0) {
      setStatus("Select at least one platform.");
      return;
    }
    if (!content.trim()) {
      setStatus("Post content is required.");
      return;
    }
    if (minRemaining < 0) {
      setStatus("Post exceeds one or more platform limits.");
      return;
    }

    setSaving(true);
    setStatus("");

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setStatus("You are not logged in.");
      return;
    }

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        content,
        status: "SCHEDULED",
        scheduled_at: new Date(scheduledAt).toISOString()
      })
      .select("id")
      .single();

    if (postError || !post) {
      if ((postError as { code?: string } | null)?.code === "402") {
        setShowUpgrade(true);
      }
      setSaving(false);
      setStatus("Could not create post.");
      return;
    }

    const targets = selectedPlatforms.map((platform) => ({ post_id: post.id, platform }));
    const plugs = selectedPlatforms.map((platform) => ({
      post_id: post.id,
      platform,
      plug_content: autoPlugState[platform].plugContent || "Check this out: https://flapr.app",
      trigger_type: autoPlugState[platform].triggerType,
      trigger_value: autoPlugState[platform].triggerValue
    }));

    const { error: targetError } = await supabase.from("post_targets").insert(targets);
    const { error: plugError } = await supabase.from("auto_plugs").insert(plugs);

    if (targetError || plugError) {
      setSaving(false);
      setStatus("Post created but targets/plugs failed to save.");
      return;
    }

    setSaving(false);
    setStatus("Post scheduled successfully.");
    editor.commands.clearContent();
  };

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[var(--line)] bg-white p-4">
        <h2 className="text-sm font-semibold">Post Content</h2>
        <div className="mt-3 rounded-lg border border-slate-200 p-3">
          <EditorContent editor={editor} className="min-h-[140px]" />
        </div>
        <p className="mt-2 text-sm text-slate-600">Character headroom: {minRemaining}</p>
      </section>

      <section className="rounded-xl border border-[var(--line)] bg-white p-4">
        <h2 className="text-sm font-semibold">Platforms</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <label key={platform} className="inline-flex items-center gap-2 rounded border border-slate-300 px-3 py-1.5 text-sm">
              <input type="checkbox" checked={selectedPlatforms.includes(platform)} onChange={() => togglePlatform(platform)} />
              {platform}
            </label>
          ))}
        </div>
        <label className="mt-4 block text-sm">
          Schedule at
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
            className="mt-1 block rounded border border-slate-300 px-3 py-1.5"
          />
        </label>
      </section>

      <section>
        <AutoPlugConfig selectedPlatforms={selectedPlatforms} value={autoPlugState} onChange={setAutoPlugState} />
      </section>

      <section>
        <PostPreview content={content} selectedPlatforms={selectedPlatforms} />
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="rounded bg-[var(--brand)] px-4 py-2 text-sm text-white hover:bg-[var(--brand-dark)] disabled:opacity-60"
        >
          {saving ? "Scheduling..." : "Schedule Post"}
        </button>
        {status ? <p className="text-sm text-slate-600">{status}</p> : null}
      </div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
