"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";

import { NavbarWithMenu } from "@/components/ui/navbar-menu";
import { C } from "@/lib/landing-data";

import { Hero } from "@/components/sections/Hero";

import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";

/* ── Component ────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <Suspense>
      <LandingPageInner />
    </Suspense>
  );
}

function LandingPageInner() {
  const searchParams = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  useEffect(() => {
    const tab = searchParams.get("tab");
    const mode = searchParams.get("mode");
    if (mode === "login" || mode === "register") {
      setAuthTab(mode);
      setAuthOpen(true);
    } else if (tab === "register") {
      setAuthTab("register");
      setAuthOpen(true);
    }
  }, [searchParams]);

  const openAuth = (tab: "login" | "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  return (
    <>
      <main
        className="min-h-screen w-full overflow-x-hidden tracking-tight"
      >
        {/* ─── THE RESPONSIVE CONTAINER ─── */}
        <div className="mx-auto min-h-screen w-full max-w-[720px] px-5 md:px-8">
          {/* ─── NAV ─── */}
          <NavbarWithMenu
            navItems={[
              { type: "link", label: "Pricing", href: "#pricing" },
            ]}
            sections={[]}
            logo={
              <Link
                href="/"
                className="text-xl font-medium tracking-tighter"
                style={{ color: C.text }}
              >
                Flapr
              </Link>
            }
            cta={
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuth("login")}
                  className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-[15px] font-medium transition-all duration-[350ms] cursor-pointer hover:bg-white/[0.06] active:scale-[0.97]"
                  style={{ color: "inherit" }}
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-6 text-[15px] font-semibold transition-all duration-[350ms] cursor-pointer active:scale-[0.97] hover:brightness-110"
                  style={{ backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
                >
                  Start free
                </button>
              </div>
            }
          />

          <Hero onOpenAuth={openAuth} />
          {/* Features section removed */}
          <Pricing onOpenAuth={openAuth} />
          <FAQ />
          <Footer onOpenAuth={openAuth} />
        </div>
      </main>

      {/* ─── AUTH MODAL OVERLAY ─── */}
      {authOpen && (
        <AuthModal
          tab={authTab}
          onTabChange={setAuthTab}
          onClose={() => setAuthOpen(false)}
        />
      )}
    </>
  );
}
