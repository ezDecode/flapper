"use client";

import { useMemo } from "react";
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

const triggerOptions: TriggerType[] = ["LIKES", "COMMENTS", "REPOSTS"];

export function AutoPlugConfig({ selectedPlatforms, value, onChange }: Props) {
  const active = useMemo(() => selectedPlatforms, [selectedPlatforms]);

  if (active.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        Select at least one platform to configure auto-plug triggers.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {active.map((platform) => {
        const platformConfig = value[platform];

        return (
          <section key={platform} className="rounded-xl border border-[var(--line)] bg-white p-4">
            <h3 className="text-sm font-semibold">{platform}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <select
                value={platformConfig.triggerType}
                className="rounded border border-slate-300 px-2 py-1 text-sm"
                onChange={(event) =>
                  onChange({
                    ...value,
                    [platform]: { ...platformConfig, triggerType: event.target.value as TriggerType }
                  })
                }
              >
                {triggerOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={platformConfig.triggerValue}
                className="w-24 rounded border border-slate-300 px-2 py-1 text-sm"
                onChange={(event) =>
                  onChange({
                    ...value,
                    [platform]: { ...platformConfig, triggerValue: Number(event.target.value) || 1 }
                  })
                }
              />
            </div>
            <textarea
              value={platformConfig.plugContent}
              rows={3}
              placeholder="Reply content when trigger fires..."
              className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) =>
                onChange({
                  ...value,
                  [platform]: { ...platformConfig, plugContent: event.target.value }
                })
              }
            />
          </section>
        );
      })}
    </div>
  );
}
