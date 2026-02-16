import { PlatformConnector } from "@/components/PlatformConnector";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import {
  Link2,
  CreditCard,
  Zap,
  ChevronRight,
} from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id ?? "";

  const [{ data: profileRaw }, { count: postCount }, { data: firedPlugsRaw }] =
    await Promise.all([
      supabase.from("users").select("plan").eq("id", userId).single(),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("auto_plugs")
        .select("id, posts!inner(user_id)")
        .eq("status", "FIRED")
        .eq("posts.user_id", userId),
    ]);

  const profile = profileRaw as { plan: "FREE" | "PRO" } | null;
  const plan = profile?.plan ?? "FREE";
  const plugCount =
    (firedPlugsRaw as Array<{ id: string }> | null)?.length ?? 0;
  const posts = postCount ?? 0;

  const postLimit = plan === "FREE" ? 10 : plan === "PRO" ? 100 : Infinity;
  const plugLimit = plan === "FREE" ? 5 : plan === "PRO" ? 50 : Infinity;
  const postLimitLabel = String(postLimit);
  const plugLimitLabel = String(plugLimit);

  const postPct =
    postLimit === Infinity ? 0 : Math.min((posts / postLimit) * 100, 100);
  const plugPct =
    plugLimit === Infinity ? 0 : Math.min((plugCount / plugLimit) * 100, 100);

  const planBadge: Record<string, string> = {
    FREE: "bg-zinc-100 text-zinc-700 border border-zinc-200",
    PRO: "bg-[#F0ECFE] text-[#7C3AED] border border-[#DDD5FD]",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-zinc-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          Manage platforms, plan, and billing
        </p>
      </div>

      {/* Connected Platforms */}
      <section className="rounded-xl border border-[#E8E8E4] bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#E8E8E4] px-6 py-4">
          <Link2 size={16} className="text-[#6B6B6B]" />
          <h2 className="text-sm font-medium text-zinc-900">
            Connected Platforms
          </h2>
        </div>
        <div className="p-6">
          <PlatformConnector />
        </div>
      </section>

      {/* Plan & Billing */}
      <section className="rounded-xl border border-[#E8E8E4] bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#E8E8E4] px-6 py-4">
          <CreditCard size={16} className="text-[#6B6B6B]" />
          <h2 className="text-sm font-medium text-zinc-900">
            Subscription &amp; Billing
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Current plan */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B6B6B]">Current plan</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    planBadge[plan]
                  )}
                >
                  {plan}
                </span>
                {plan === "FREE" && (
                  <span className="text-xs text-[#6B6B6B]">
                    Limited features
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Usage meters */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Posts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6B6B]">Monthly Posts</span>
                <span className="font-medium text-zinc-900">
                  {posts}/{postLimitLabel}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    postPct >= 90 ? "bg-[#E03131]" : "bg-[#7C3AED]"
                  )}
                  style={{ width: `${postPct}%` }}
                />
              </div>
            </div>

            {/* Plugs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6B6B]">Monthly Auto-Plugs</span>
                <span className="font-medium text-zinc-900">
                  {plugCount}/{plugLimitLabel}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    plugPct >= 90 ? "bg-[#E03131]" : "bg-[#2B8A3E]"
                  )}
                  style={{ width: `${plugPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3 pt-2">
            {plan === "FREE" ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#8B5CF6]"
              >
                <Zap size={15} />
                Upgrade to Pro — $19/mo
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-[#E8E8E4] bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-[#FAFAF8]"
              >
                <CreditCard size={15} />
                Manage billing
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
