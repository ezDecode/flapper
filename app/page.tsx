"use client";

import Link from "next/link";
import {
  Check,
  ArrowRight,
  Zap,
  Clock,
  BarChart3,
  MessageSquare,
  Target,
  Shield,
  Play,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import { RaisedButton } from "@/components/ui/raised-button";
import { FeatureCard } from "@/components/ui/feature-card";

/* ── Data ─────────────────────────────────────────────── */

const features = [
  {
    icon: Clock,
    title: "Smart Scheduling",
    desc: "Queue posts across Twitter/X, LinkedIn, and Bluesky. Pick your time or let Flapr find the best slot.",
    className: "md:col-span-2",
  },
  {
    icon: Zap,
    title: "Auto-Plug Engine",
    desc: "Set a like threshold. When your post hits it, Flapr auto-replies with your CTA — zero delay.",
    className: "md:col-span-1",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    desc: "Track impressions, engagement, and conversions. Know exactly which posts drive results.",
    className: "md:col-span-1",
  },
  {
    icon: MessageSquare,
    title: "CTA Templates",
    desc: "Pre-write your plugs once. Reuse across posts. A/B test different CTAs to optimize clicks.",
    className: "md:col-span-2",
  },
  {
    icon: Shield,
    title: "Multi-Platform Sync",
    desc: "One dashboard for every platform. Manage all your content and auto-plugs from a single place.",
    className: "md:col-span-3",
  },
];

const steps = [
  {
    num: "01",
    title: "Draft & Schedule",
    description: "Write once and publish across platforms at the right time.",
  },
  {
    num: "02",
    title: "Set the trigger",
    description: "Choose the signal that means your post is gaining traction.",
  },
  {
    num: "03",
    title: "Auto-plug fires",
    description:
      "Flapr replies instantly with your CTA — while attention is highest.",
  },
];

const testimonials = [
  {
    quote:
      "Scheduled a post and stepped away for the weekend. Came back to new customers from the auto-plug.",
    name: "Sarah Chen",
    role: "Indie maker · 12K followers",
  },
  {
    quote:
      "I used to manually reply to my own viral tweets. Now Flapr does it in milliseconds. Game changer.",
    name: "Marcus Rivera",
    role: "SaaS founder · 8K followers",
  },
  {
    quote:
      "The ROI is insane. $19/mo and it's already paid for itself ten times over from auto-plug conversions.",
    name: "Priya Sharma",
    role: "Content creator · 22K followers",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    features: [
      "10 posts / month",
      "5 auto-plugs",
      "2 platforms",
      "Basic analytics",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    features: [
      "100 posts",
      "50 auto-plugs",
      "All platforms",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Choose Pro",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$49",
    period: "/ month",
    features: [
      "Unlimited posts & plugs",
      "All platforms",
      "1-year analytics history",
      "Team features (soon)",
      "Dedicated support",
    ],
    cta: "Choose Agency",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Is there a free plan?",
    a: "Yes. Start free — no credit card required.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Upgrade, downgrade, or cancel anytime.",
  },
  {
    q: "How does the auto-plug work?",
    a: "Set a threshold (like 50 likes). When it\u2019s reached, Flapr replies with your CTA automatically.",
  },
  {
    q: "Which platforms are supported?",
    a: "Twitter/X, LinkedIn, and Bluesky. More coming soon.",
  },
];

/* ── Palette ──────────────────────────────────────────── */

const C = {
  bg: "#0C0C0E",
  bgAlt: "#131316",
  surface: "#1A1A1E",
  surfaceHover: "#222226",
  border: "#27272B",
  text: "#F1F1F3",
  textSoft: "#A1A1AA",
  textMuted: "#63636E",
  accent: "#8B5CF6",
  accentSoft: "rgba(139, 92, 246, 0.12)",
};

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border transition-all duration-300",
        isOpen ? "bg-white/5 border-white/10" : "bg-transparent border-transparent hover:bg-white/[0.02]"
      )}
      style={{ borderColor: isOpen ? C.border : 'transparent' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-lg font-medium" style={{ color: C.text }}>{q}</span>
        {isOpen ? (
          <Minus className="h-5 w-5 shrink-0 transition-transform duration-300" style={{ color: C.accent }} />
        ) : (
          <Plus className="h-5 w-5 shrink-0 transition-transform duration-300" style={{ color: C.textSoft }} />
        )}
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out px-6",
          isOpen ? "max-h-40 opacity-100 pb-6" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-base leading-relaxed font-normal" style={{ color: C.textSoft }}>
          {a}
        </p>
      </div>
    </div>
  )
}

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
        <div className="mx-auto min-h-screen w-full border-x border-white/[0.03] md:w-[90%] lg:w-[80%] xl:w-[70%]">

          {/* ─── NAV ─── */}
          <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.03] bg-[#0C0C0E]/80 px-4 py-5 backdrop-blur-xl md:px-8">
            <Link
              href="/"
              className="text-xl font-medium tracking-tighter"
              style={{ color: C.text }}
            >
              Flapr
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              <a href="#features" className="text-sm font-medium transition-colors hover:text-white" style={{ color: C.textSoft }}>Features</a>
              <a href="#how-it-works" className="text-sm font-medium transition-colors hover:text-white" style={{ color: C.textSoft }}>How it works</a>
              <a href="#pricing" className="text-sm font-medium transition-colors hover:text-white" style={{ color: C.textSoft }}>Pricing</a>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => openAuth("login")}
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: C.textSoft }}
              >
                Log in
              </button>
              <RaisedButton
                onClick={() => openAuth("register")}
                color={C.accent}
                className="h-9 px-5 text-sm font-medium"
              >
                Start free
              </RaisedButton>
            </div>
          </header>

          {/* ─── HERO ─── */}
          <section className="relative flex flex-col items-center justify-center px-4 py-20 text-center md:px-8 md:py-32">
            <div
              className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
              style={{
                borderColor: C.border,
                color: C.textSoft,
                background: C.surface,
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Now in public beta
            </div>

            <h1 className="max-w-4xl text-[clamp(3rem,9vw,6rem)] font-medium tracking-tighter leading-[0.95] md:leading-[0.9]">
              <span style={{ color: C.text }}>Let your posts work</span>
              <br />
              <span style={{ color: C.textMuted }}>after you log off.</span>
            </h1>

            <p
              className="mt-8 max-w-xl text-lg leading-relaxed text-balance font-normal"
              style={{ color: C.textSoft }}
            >
              Schedule detailed threads. Set engagement triggers. Flapr replies with your
              CTA exactly when your post takes off — capturing every opportunity while you sleep.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <RaisedButton
                onClick={() => openAuth("register")}
                size="lg"
                color={C.accent}
                className="h-12 px-8 text-base font-medium"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </RaisedButton>
              <div
                className="flex items-center gap-4 px-4 text-sm font-medium"
                style={{ color: C.textMuted }}
              >
                <i className="devicon-twitter-original" />
                <i className="devicon-linkedin-plain" />
                <span>Bluesky</span>
              </div>
            </div>
          </section>

          {/* ─── FEATURES (Bento Grid) ─── */}
          <section id="features" className="border-t border-white/[0.03] px-4 py-20 md:px-8 md:py-24">
            <div className="mb-16">
              <h2 className="text-[clamp(2.25rem,5vw,3rem)] font-medium tracking-tight leading-tight" style={{ color: C.text }}>
                Everything needed to<br />
                <span style={{ color: C.textMuted }}>convert attention.</span>
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {features.map((f, i) => (
                <FeatureCard
                  key={i}
                  icon={f.icon}
                  title={f.title}
                  description={f.desc}
                  className={f.className}
                />
              ))}
            </div>
          </section>

          {/* ─── HOW IT WORKS ─── */}
          <section id="how-it-works" className="border-t border-white/[0.03] px-4 py-20 md:px-8 md:py-24">
            <div className="grid gap-16 lg:grid-cols-2">
              <div className="self-start lg:sticky lg:top-32">
                <h2 className="text-[clamp(2.25rem,5vw,3rem)] font-medium tracking-tight leading-tight" style={{ color: C.text }}>
                  Three steps.<br />
                  <span style={{ color: C.textMuted }}>Zero friction.</span>
                </h2>
                <p className="mt-6 text-lg font-normal" style={{ color: C.textSoft }}>
                  Stop gluing together Zapier, Buffer, and makeshift scripts.
                  Flapr handles the entire lifecycle of a viral post in one cohesive workflow.
                </p>
              </div>

              <div className="space-y-8">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="relative rounded-3xl border p-8"
                    style={{ background: C.surface, borderColor: C.border }}
                  >
                    <span
                      className="mb-4 block text-xs font-medium uppercase tracking-wider"
                      style={{ color: C.accent }}
                    >
                      Step {step.num}
                    </span>
                    <h3 className="mb-2 text-2xl font-medium" style={{ color: C.text }}>
                      {step.title}
                    </h3>
                    <p className="text-base font-normal" style={{ color: C.textSoft }}>
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── TESTIMONIALS ─── */}
          <section className="border-t border-white/[0.03] px-4 py-20 md:px-8 md:py-24">
            <h2 className="mb-16 text-center text-[clamp(2rem,4vw,2.5rem)] font-medium tracking-tight" style={{ color: C.text }}>
              Loved by builders who ship.
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded-3xl border p-8"
                  style={{ background: C.bgAlt, borderColor: C.border }}
                >
                  <p className="text-base leading-relaxed font-normal" style={{ color: C.textSoft }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-8">
                    <p className="font-medium" style={{ color: C.text }}>{t.name}</p>
                    <p className="text-xs font-normal" style={{ color: C.textMuted }}>{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── PRICING ─── */}
          <section id="pricing" className="border-t border-white/[0.03] px-4 py-20 md:px-8 md:py-24">
            <div className="mb-16 text-center">
              <h2 className="text-[clamp(2.25rem,5vw,3rem)] font-medium tracking-tight" style={{ color: C.text }}>
                Simple pricing.
              </h2>
              <p className="mt-4 text-lg font-normal" style={{ color: C.textSoft }}>
                Start free. Upgrade when it proves its value.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className="flex flex-col rounded-3xl border p-8"
                  style={{
                    background: plan.highlighted ? C.surfaceHover : C.surface,
                    borderColor: plan.highlighted ? C.accent : C.border,
                    position: 'relative'
                  }}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-1 text-xs font-medium text-white shadow-lg shadow-indigo-500/25">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-xl font-medium" style={{ color: C.text }}>{plan.name}</h3>
                  <div className="mt-4 mb-8 flex items-baseline">
                    <span className="text-4xl font-medium" style={{ color: C.text }}>{plan.price}</span>
                    <span className="ml-1 text-sm font-normal" style={{ color: C.textMuted }}>{plan.period}</span>
                  </div>

                  <ul className="mb-8 flex-1 space-y-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-3 text-sm font-normal" style={{ color: C.textSoft }}>
                        <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.accent }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <RaisedButton
                    onClick={() => openAuth("register")}
                    color={plan.highlighted ? C.accent : undefined}
                    className={cn("w-full font-medium", !plan.highlighted && "bg-transparent border border-white/10 hover:bg-white/5")}
                  >
                    {plan.cta}
                  </RaisedButton>
                </div>
              ))}
            </div>
          </section>

          {/* ─── FAQ ─── */}
          <section className="border-t border-white/[0.03] px-4 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-12 text-center text-[clamp(2rem,4vw,2.5rem)] font-medium tracking-tight" style={{ color: C.text }}>
                Common<br className="md:hidden" /> Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <FAQItem key={i} {...faq} />
                ))}
              </div>
            </div>
          </section>

          {/* ─── FOOTER ─── */}
          <footer className="border-t border-white/[0.03] px-4 py-12 md:px-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <p className="text-sm font-medium" style={{ color: C.textMuted }}>
                &copy; 2026 Flapr Inc.
              </p>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-sm font-medium hover:text-white" style={{ color: C.textMuted }}>Privacy</Link>
                <Link href="/terms" className="text-sm font-medium hover:text-white" style={{ color: C.textMuted }}>Terms</Link>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-white" style={{ color: C.textMuted }}>Twitter</a>
              </div>
            </div>
          </footer>

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
