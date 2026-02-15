"use client";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function UpgradeModal({ open, onClose }: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">Usage limit reached</h2>
        <p className="mt-2 text-sm text-slate-600">Upgrade to Pro or Agency to continue scheduling and firing auto-plugs.</p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            className="rounded border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
            onClick={onClose}
          >
            Close
          </button>
          <a href="/settings" className="rounded bg-[var(--brand)] px-4 py-2 text-sm text-white hover:bg-[var(--brand-dark)]">
            View plans
          </a>
        </div>
      </div>
    </div>
  );
}
