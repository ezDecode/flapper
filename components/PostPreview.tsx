"use client";

import type { Platform } from "@/lib/constants";

type Props = {
  content: string;
  selectedPlatforms: Platform[];
};

export function PostPreview({ content, selectedPlatforms }: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white p-4">
      <h3 className="text-sm font-semibold">Post Preview</h3>
      {selectedPlatforms.length === 0 ? (
        <p className="text-sm text-slate-600">Select one or more platforms to preview your post.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {selectedPlatforms.map((platform) => (
            <article key={platform} className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-medium uppercase text-slate-500">{platform}</p>
              <p className="mt-2 text-sm whitespace-pre-wrap">{content || "Your post preview appears here."}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
