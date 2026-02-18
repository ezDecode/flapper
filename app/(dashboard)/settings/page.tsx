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
    FREE: "bg-muted text-muted-foreground border border-border",
    PRO: "bg-primary/10 text-primary border border-primary/20",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage platforms, plan, and billing
        </p>
      </div>

      {/* Connected Platforms */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <Link2 size={16} className="text-muted-foreground" />
          <h2 className="text-sm font-medium text-foreground">
            Connected Platforms
          </h2>
        </div>
        <div className="p-6">
          <PlatformConnector />
        </div>
      </section>

      {/* Plan & Billing */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <CreditCard size={16} className="text-muted-foreground" />
          <h2 className="text-sm font-medium text-foreground">
            Subscription &amp; Billing
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Current plan */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current plan</p>
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
                  <span className="text-xs text-muted-foreground">
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
                <span className="text-muted-foreground">Monthly Posts</span>
                <span className="font-medium text-foreground">
                  {posts}/{postLimitLabel}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    postPct >= 90 ? "bg-destructive" : "bg-primary"
                  )}
                  style={{ width: `${postPct}%` }}
                />
              </div>
            </div>

            {/* Plugs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monthly Auto-Plugs</span>
                <span className="font-medium text-foreground">
                  {plugCount}/{plugLimitLabel}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    plugPct >= 90 ? "bg-destructive" : "bg-success"
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
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
              >
                <Zap size={15} />
                Upgrade to Pro — $19/mo
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-surface-hover"
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
