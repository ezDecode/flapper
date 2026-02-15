import { PlatformConnector } from "@/components/PlatformConnector";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id ?? "";

  const [{ data: profileRaw }, { count: postCount }, { data: firedPlugsRaw }] = await Promise.all([
    supabase.from("users").select("plan").eq("id", userId).single(),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("auto_plugs").select("id, posts!inner(user_id)").eq("status", "FIRED").eq("posts.user_id", userId)
  ]);

  const profile = profileRaw as { plan: "FREE" | "PRO" | "AGENCY" } | null;
  const plan = profile?.plan ?? "FREE";
  const plugCount = (firedPlugsRaw as Array<{ id: string }> | null)?.length ?? 0;
  const postLimit = plan === "FREE" ? 10 : plan === "PRO" ? 100 : "Unlimited";
  const plugLimit = plan === "FREE" ? 5 : plan === "PRO" ? 50 : "Unlimited";

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="rounded-xl border border-[var(--line)] bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold">Connected platforms</h2>
        <PlatformConnector />
      </section>

      <section className="rounded-xl border border-[var(--line)] bg-white p-4">
        <h2 className="text-sm font-semibold">Plan & billing</h2>
        <p className="mt-2 text-sm text-slate-700">Current plan: {plan}</p>
        <p className="mt-1 text-sm text-slate-600">
          Posts this month: {postCount ?? 0}/{postLimit}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Plugs fired this month: {plugCount ?? 0}/{plugLimit}
        </p>
        <div className="mt-3 flex gap-2">
          {plan === "FREE" ? (
            <button type="button" className="rounded bg-[var(--brand)] px-4 py-2 text-sm text-white hover:bg-[var(--brand-dark)]">
              Upgrade to Pro $19/mo
            </button>
          ) : (
            <button type="button" className="rounded border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
              Manage billing
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
