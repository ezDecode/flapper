import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/compose", label: "Compose" },
  { href: "/schedule", label: "Schedule" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" }
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileRaw } = await supabase.from("users").select("plan, onboarding_step, name, email").eq("id", user.id).single();
  const profile = profileRaw as
    | {
        plan: "FREE" | "PRO" | "AGENCY";
        onboarding_step: number;
        name: string | null;
        email: string;
      }
    | null;

  if ((profile?.onboarding_step ?? 0) < 3) {
    redirect("/onboarding");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-2xl border border-[var(--line)] bg-white p-4">
        <div className="mb-4 rounded-lg bg-brand-50 px-3 py-2">
          <p className="text-sm font-medium">{profile?.name || profile?.email || "Flapr User"}</p>
          <p className="text-xs text-slate-600">Plan: {profile?.plan ?? "FREE"}</p>
        </div>
        <nav className="space-y-1 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="space-y-4">{children}</section>
    </div>
  );
}
