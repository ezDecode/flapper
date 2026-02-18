"use client";

import { Twitter, MessageSquare } from "lucide-react";
import { PLATFORM_CHAR_LIMITS, type Platform } from "@/lib/constants";

type Props = {
  content: string;
  selectedPlatforms: Platform[];
};

const platformMeta: Record<
  Platform,
  { icon: React.ReactNode; label: string; color: string; bgClass: string }
> = {
  TWITTER: {
    icon: <Twitter size={16} />,
    label: "Twitter / X",
    color: "#FFFFFF",
    bgClass: "bg-white/10",
  },
};

export function PostPreview({ content, selectedPlatforms }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            Post Preview
          </p>
        </div>
      </div>
      <div className="p-6">
        {selectedPlatforms.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Select one or more platforms to preview your post.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {selectedPlatforms.map((platform) => {
              const meta = platformMeta[platform];
              const charLimit = PLATFORM_CHAR_LIMITS[platform];
              const remaining = charLimit - content.length;

              return (
                <div
                  key={platform}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${meta.bgClass}`}
                        style={{ color: meta.color }}
                      >
                        {meta.icon}
                      </div>
                      <p className="text-xs font-medium text-foreground">
                        {meta.label}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${remaining < 0 ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {remaining}
                    </span>
                  </div>

                  <div className="mt-3 min-h-[80px] rounded-lg bg-card border border-border/50 p-3 shadow-sm">
                    <p className="text-sm whitespace-pre-wrap text-foreground">
                      {content || (
                        <span className="text-muted-foreground italic">
                          Your post preview appears here…
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
