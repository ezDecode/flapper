"use client";

import { useMemo, useState } from "react";
import CharacterCount from "@tiptap/extension-character-count";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { addMinutes } from "date-fns";
import {
  Send,
  Clock,
  Twitter,
  AlertCircle,
  Check,
} from "lucide-react";
import { AutoPlugConfig, type AutoPlugState } from "@/components/AutoPlugConfig";
import { PostPreview } from "@/components/PostPreview";
import { UpgradeModal } from "@/components/UpgradeModal";
import { PLATFORM_CHAR_LIMITS, type Platform } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";


const platforms = Object.keys(PLATFORM_CHAR_LIMITS) as Platform[];

const defaultAutoPlug: AutoPlugState = {
  TWITTER: { triggerType: "LIKES", triggerValue: 100, plugContent: "" },
};

const platformMeta: Record<
  Platform,
  { icon: React.ReactNode; label: string; color: string; bgClass: string }
> = {
  TWITTER: {
    icon: <Twitter size={16} />,
    label: "Twitter / X",
    color: "hsl(var(--foreground))",
    bgClass: "bg-primary/10",
  },
};

export function PostComposer() {
  const supabase = createClient();
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "TWITTER",
  ]);
  const [autoPlugState, setAutoPlugState] =
    useState<AutoPlugState>(defaultAutoPlug);
  const [scheduledAt, setScheduledAt] = useState(
    addMinutes(new Date(), 15).toISOString().slice(0, 16)
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit: 3000 })],
    content: "",
  });

  const content = editor?.getText() ?? "";

  const minRemaining = useMemo(() => {
    if (selectedPlatforms.length === 0) {
      return 0;
    }
    return Math.min(
      ...selectedPlatforms.map(
        (platform) => PLATFORM_CHAR_LIMITS[platform] - content.length
      )
    );
  }, [content.length, selectedPlatforms]);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((item) => item !== platform)
        : [...prev, platform]
    );
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
      setStatus("Please add some content to your post.");
      return;
    }
    if (minRemaining < 0) {
      setStatus("Post exceeds one or more platform limits.");
      return;
    }

    setSaving(true);
    setStatus("");

    const {
      data: { user },
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
        scheduled_at: new Date(scheduledAt).toISOString(),
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

    const targets = selectedPlatforms.map((platform) => ({
      post_id: post.id,
      platform,
    }));
    const plugs = selectedPlatforms.map((platform) => ({
      post_id: post.id,
      platform,
      plug_content:
        autoPlugState[platform].plugContent ||
        "Check this out: https://flapr.app",
      trigger_type: autoPlugState[platform].triggerType,
      trigger_value: autoPlugState[platform].triggerValue,
    }));

    const { error: targetError } = await supabase
      .from("post_targets")
      .insert(targets);
    const { error: plugError } = await supabase
      .from("auto_plugs")
      .insert(plugs);

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
    <div className="flex flex-col gap-5">
      {/* Editor */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              New Post
            </p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${minRemaining < 0
                  ? "bg-destructive/10 text-destructive border border-destructive/50"
                  : "bg-muted text-muted-foreground"
                }`}
            >
              {minRemaining} chars remaining
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="min-h-[160px] rounded-lg border border-border bg-surface-hover p-4 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
            <EditorContent
              editor={editor}
              className="prose prose-sm prose-invert max-w-none focus:outline-none [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:outline-none text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Platform selector + Schedule */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <p className="text-sm font-medium text-foreground">
            Destinations &amp; Schedule
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-4">
            <div>
              <span className="mb-2 block text-xs text-muted-foreground">
                Select platforms
              </span>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => {
                  const meta = platformMeta[platform];
                  const isSelected = selectedPlatforms.includes(platform);

                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-medium transition-all ${isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface-hover text-muted-foreground hover:border-primary/40"
                        }`}
                    >
                      <span style={{ color: isSelected ? meta.color : undefined }}>
                        {meta.icon}
                      </span>
                      {meta.label}
                      {isSelected && (
                        <Check size={14} className="text-success" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="mb-2 block text-xs text-muted-foreground">
                Schedule at
              </span>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="h-9 rounded-lg border border-border bg-surface-hover px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-plug config */}
      <AutoPlugConfig
        selectedPlatforms={selectedPlatforms}
        value={autoPlugState}
        onChange={setAutoPlugState}
      />

      {/* Preview */}
      <PostPreview content={content} selectedPlatforms={selectedPlatforms} />

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          onClick={submit}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-4 py-2 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          style={{ backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
        >
          <Send size={16} />
          {saving ? "Scheduling…" : "Schedule Post"}
        </button>
        {status ? (
          <div className="flex items-center gap-1">
            {status.includes("successfully") ? (
              <Check size={14} className="text-foreground" />
            ) : (
              <AlertCircle size={14} className="text-foreground" />
            )}
            <p
              className={`text-sm ${status.includes("successfully")
                  ? "text-foreground"
                  : "text-foreground"
                }`}
            >
              {status}
            </p>
          </div>
        ) : null}
      </div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
