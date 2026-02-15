import { createClient } from "@/lib/supabase/server";
import {
  Calendar,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  SCHEDULED:
    "bg-blue-50 text-blue-700 border border-blue-200",
  PUBLISHED:
    "bg-emerald-50 text-[#2B8A3E] border border-emerald-200",
  FAILED:
    "bg-red-50 text-[#E03131] border border-red-200",
  DRAFT:
    "bg-zinc-100 text-zinc-600 border border-zinc-200",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id ?? "";

  const [
    { count: scheduled },
    { count: published },
    { count: failed },
    { data: firedPlugs },
    { data: recentPostsRaw },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "SCHEDULED"),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "PUBLISHED"),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "FAILED"),
    supabase
      .from("auto_plugs")
      .select("id, posts!inner(user_id)")
      .eq("status", "FIRED")
      .eq("posts.user_id", userId),
    supabase
      .from("posts")
      .select("id, content, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const recentPosts =
    (recentPostsRaw as Array<{
      id: string;
      content: string;
      status: string;
      created_at: string;
    }> | null) ?? [];
  const plugsFired =
    (firedPlugs as Array<{ id: string }> | null)?.length ?? 0;

  const stats = [
    {
      label: "Scheduled",
      value: scheduled ?? 0,
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Plugs Fired",
      value: plugsFired,
      icon: Zap,
      color: "text-[#F76707]",
      bg: "bg-orange-50",
    },
    {
      label: "Published",
      value: published ?? 0,
      icon: CheckCircle2,
      color: "text-[#2B8A3E]",
      bg: "bg-emerald-50",
    },
    {
      label: "Failed",
      value: failed ?? 0,
      icon: AlertCircle,
      color: "text-[#E03131]",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          Overview of your posting activity
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="rounded-xl border border-[#E8E8E4] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6B6B6B]">
                  {stat.label}
                </span>
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    stat.bg
                  )}
                >
                  <Icon size={18} className={stat.color} strokeWidth={2} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
                {stat.value}
              </p>
            </article>
          );
        })}
      </div>

      {/* Recent posts */}
      <section className="rounded-xl border border-[#E8E8E4] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E8E8E4] px-6 py-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#6B6B6B]" />
            <h2 className="text-sm font-semibold text-zinc-900">
              Recent Posts
            </h2>
          </div>
          <span className="text-xs text-[#6B6B6B]">Last 10</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E8E8E4] text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                <th className="px-6 py-3">Content</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E4]">
              {recentPosts.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-sm text-[#6B6B6B]"
                  >
                    No posts yet. Start composing!
                  </td>
                </tr>
              )}
              {recentPosts.map((post) => (
                <tr
                  key={post.id}
                  className="transition-colors hover:bg-[#FAFAF8]"
                >
                  <td className="px-6 py-3.5 pr-4 text-zinc-800">
                    {post.content.slice(0, 80)}
                    {post.content.length > 80 && "…"}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        statusStyles[post.status] ??
                          "bg-zinc-100 text-zinc-600 border border-zinc-200"
                      )}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-[#6B6B6B]">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
