import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id ?? "";

  const [{ count: scheduled }, { count: published }, { count: failed }, { data: firedPlugs }, { data: recentPostsRaw }] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "SCHEDULED"),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "PUBLISHED"),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "FAILED"),
    supabase.from("auto_plugs").select("id, posts!inner(user_id)").eq("status", "FIRED").eq("posts.user_id", userId),
    supabase
      .from("posts")
      .select("id, content, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)
  ]);

  const recentPosts = (recentPostsRaw as Array<{ id: string; content: string; status: string; created_at: string }> | null) ?? [];
  const plugsFired = (firedPlugs as Array<{ id: string }> | null)?.length ?? 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Posts Scheduled" value={scheduled ?? 0} />
        <StatCard label="Plugs Fired" value={plugsFired ?? 0} accent="text-green-700" />
        <StatCard label="Published" value={published ?? 0} />
        <StatCard label="Failed" value={failed ?? 0} accent="text-red-700" />
      </div>

      <section className="rounded-xl border border-[var(--line)] bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold">Recent posts</h2>
        <div className="overflow-auto">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead>
              <tr className="text-slate-600">
                <th className="py-2">Content</th>
                <th className="py-2">Status</th>
                <th className="py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((post) => (
                <tr key={post.id} className="border-t border-slate-200">
                  <td className="py-2 pr-3">{post.content.slice(0, 80)}</td>
                  <td className="py-2">{post.status}</td>
                  <td className="py-2">{new Date(post.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <article className="rounded-xl border border-[var(--line)] bg-white p-4">
      <p className="text-sm text-slate-600">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent ?? ""}`}>{value}</p>
    </article>
  );
}
