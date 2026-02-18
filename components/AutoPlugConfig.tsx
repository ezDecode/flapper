"use client";

import { useMemo } from "react";
import { Zap, Heart, MessageSquare, Repeat2 } from "lucide-react";
import type { Platform } from "@/lib/constants";

export type TriggerType = "LIKES" | "COMMENTS" | "REPOSTS";

export type AutoPlugState = Record<
  Platform,
  {
    triggerType: TriggerType;
    triggerValue: number;
    plugContent: string;
  }
>;

type Props = {
  selectedPlatforms: Platform[];
  value: AutoPlugState;
  onChange: (next: AutoPlugState) => void;
};

const triggerOptions: { value: TriggerType; label: string; icon: React.ReactNode }[] = [
  { value: "LIKES", label: "Likes", icon: <Heart size={14} /> },
  { value: "COMMENTS", label: "Comments", icon: <MessageSquare size={14} /> },
  { value: "REPOSTS", label: "Reposts", icon: <Repeat2 size={14} /> },
];

const platformLabels: Record<Platform, string> = {
  TWITTER: "Twitter / X",
};

export function AutoPlugConfig({ selectedPlatforms, value, onChange }: Props) {
  const active = useMemo(() => selectedPlatforms, [selectedPlatforms]);

  if (active.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E8E8E4] bg-[#FAFAF8] px-6 py-10 text-center">
        <Zap size={24} className="mx-auto mb-2 text-[#6B6B6B]" />
        <p className="text-sm text-[#6B6B7B]">
          Select at least one platform to configure auto-plug triggers.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Zap size={16} className="text-[#1A1A2E]" />
        <p className="text-sm font-medium text-[#1A1A2E]">
          Auto-Plug Configuration
        </p>
      </div>

      {active.map((platform) => {
        const config = value[platform];

        return (
          <div key={platform} className="rounded-xl border border-[#E8E8E4] bg-white">
            <div className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-white" />
                  <p className="text-sm font-medium text-[#1A1A2E]">
                    {platformLabels[platform]}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#6B6B6B]">
                      Trigger type
                    </label>
                    <div className="flex gap-1">
                      {triggerOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            onChange({
                              ...value,
                              [platform]: { ...config, triggerType: opt.value },
                            })
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            config.triggerType === opt.value
                              ? "border-white bg-white text-black"
                              : "border-[#E8E8E4] bg-white text-[#6B6B6B] hover:border-white/40"
                          }`}
                        >
                          {opt.icon}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#6B6B6B]">
                      Threshold
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={config.triggerValue}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          [platform]: {
                            ...config,
                            triggerValue: Number(e.target.value) || 1,
                          },
                        })
                      }
                      className="h-8 w-24 rounded-lg border border-[#E8E8E4] bg-white px-3 text-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#6B6B6B]">
                    Auto-reply content
                  </label>
                  <textarea
                    value={config.plugContent}
                    rows={3}
                    placeholder="When this post hits the threshold, reply with…"
                    onChange={(e) =>
                      onChange({
                        ...value,
                        [platform]: { ...config, plugContent: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-[#E8E8E4] bg-white px-3 py-2 text-sm placeholder:text-[#6B6B6B]/60 focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
