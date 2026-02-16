"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";

import { NavbarWithMenu } from "@/components/ui/navbar-menu";
import { C } from "@/lib/landing-data";

import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
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
        style={{ background: C.bg, color: C.text }}
      >
        {/* ─── THE RESPONSIVE CONTAINER ─── */}
        <div className="mx-auto min-h-screen w-full md:w-[90%] lg:w-[80%] xl:w-[70%]">
          {/* ─── NAV ─── */}
          <NavbarWithMenu
            navItems={[
              { type: "link", label: "Features", href: "#features" },
              { type: "link", label: "How it works", href: "#how-it-works" },
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
              <>
                <button
                  onClick={() => openAuth("login")}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer hover:bg-zinc-800 active:scale-[0.96]"
                  style={{ color: "inherit" }}
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="inline-flex items-center justify-center gap-2 rounded-full h-9 px-5 text-sm font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90"
                  style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
                >
                  Start free
                </button>
              </>
            }
          />

          <Hero onOpenAuth={openAuth} />
          <Features />
          <HowItWorks />
          <Testimonials />
          <Pricing onOpenAuth={openAuth} />
          <FAQ />
          <Footer />
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

