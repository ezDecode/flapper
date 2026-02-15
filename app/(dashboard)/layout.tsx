import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DesignSystemProvider } from "@/components/DesignSystemProvider";
import {
  LayoutDashboard,
  PenSquare,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/compose", label: "Compose", icon: PenSquare },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

const planColors: Record<string, string> = {
  FREE: "bg-zinc-700 text-zinc-300",
  PRO: "bg-[#7C3AED]/20 text-[#7C3AED]",
  AGENCY: "bg-purple-500/20 text-purple-400",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileRaw } = await supabase
    .from("users")
    .select("plan, onboarding_step, name, email")
    .eq("id", user.id)
    .single();
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

  const displayName = profile?.name || profile?.email || "Flapr User";
  const plan = profile?.plan ?? "FREE";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DesignSystemProvider>
      <div className="flex min-h-screen bg-[#FAFAF8]">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-[240px] lg:flex-col lg:fixed lg:inset-y-0 bg-zinc-950 text-white">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C3AED] text-sm font-medium">
              F
            </div>
            <span className="text-lg font-medium tracking-tight">Flapr</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Icon size={18} strokeWidth={1.8} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/20 text-xs font-medium text-[#7C3AED]">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-200">
                  {displayName}
                </p>
                <span
                  className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${planColors[plan]}`}
                >
                  {plan}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 inset-x-0 z-50 flex items-center gap-3 border-b border-[#E8E8E4] bg-white px-4 py-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#7C3AED] text-xs font-medium text-white">
            F
          </div>
          <span className="text-base font-medium">Flapr</span>
        </div>

        {/* Main content */}
        <main className="flex-1 lg:pl-[240px]">
          <div className="mx-auto max-w-6xl px-6 py-8 lg:py-10 mt-14 lg:mt-0">
            {children}
          </div>
        </main>
      </div>
    </DesignSystemProvider>
  );
}
