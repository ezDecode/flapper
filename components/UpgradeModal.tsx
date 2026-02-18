"use client";

import { AlertCircle, Sparkles } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function UpgradeModal({ open, onClose }: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-xl border border-border bg-card shadow-lg">
        <div className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle size={20} className="text-destructive" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Usage limit reached</h2>
            </div>

            <p className="text-sm text-muted-foreground">
              You&apos;ve hit your plan&apos;s limit for scheduling posts and
              firing auto-plugs. Upgrade to Pro to keep growing.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/settings";
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Sparkles size={16} />
                View plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
