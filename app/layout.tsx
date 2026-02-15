import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flapr",
  description: "Post it. Set it. Flapr does the rest."
};

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/compose", label: "Compose" },
  { href: "/schedule", label: "Schedule" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-[var(--line)] bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-3">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Flapr
            </Link>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-[var(--fg)]">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2 text-sm">
              <Link href="/login" className="rounded border border-[var(--line)] px-3 py-1.5 hover:bg-slate-50">
                Login
              </Link>
              <Link href="/register" className="rounded bg-[var(--brand)] px-3 py-1.5 text-white hover:bg-[var(--brand-dark)]">
                Register
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
