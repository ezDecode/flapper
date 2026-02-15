"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import { RaisedButton } from "@/components/ui/raised-button";

const steps = [
  {
    num: "01",
    title: "Draft & Schedule",
    description:
      "Write once, queue across Twitter/X, LinkedIn, and Bluesky. Pick your time or let Flapr choose the best slot.",
  },
  {
    num: "02",
    title: "Set Triggers",
    description:
      "Choose a like threshold — 50, 200, 1,000 — whatever signals your post is taking off.",
  },
  {
    num: "03",
    title: "Auto-Plug Fires",
    description:
      "The moment your post hits the threshold, Flapr replies with your CTA. Zero delay, zero effort.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "10 posts / month",
      "5 auto-plugs / month",
      "2 connected platforms",
      "Basic analytics",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    features: [
      "100 posts / month",
      "50 auto-plugs / month",
      "All 3 platforms",
      "Advanced analytics",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$49",
    period: "/ month",
    features: [
      "Unlimited posts",
      "Unlimited auto-plugs",
      "All 3 platforms",
      "1-year analytics history",
      "Team members (coming soon)",
      "Dedicated support",
    ],
    highlighted: false,
  },
];

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
      <div className="min-h-screen" style={{ background: "#FAF8F5", color: "#1A1A2E" }}>
        {/* ─── NAV ─── */}
        <nav
          className="sticky top-0 z-50 border-b backdrop-blur-md"
          style={{
            borderColor: "#E5E0D8",
            background: "rgba(250, 248, 245, 0.9)",
          }}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-lg font-medium tracking-tight"
              style={{ color: "#8B5CF6" }}
            >
              Flapr
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#how-it-works"
                className="text-sm font-normal transition-opacity hover:opacity-100"
                style={{ color: "#6B6B7B", opacity: 0.8 }}
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="text-sm font-normal transition-opacity hover:opacity-100"
                style={{ color: "#6B6B7B", opacity: 0.8 }}
              >
                Pricing
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuth("login")}
                className="rounded-lg px-4 py-2 text-sm font-normal transition-opacity hover:opacity-80"
                style={{ color: "#6B6B7B" }}
              >
                Log in
              </button>
              <RaisedButton
                onClick={() => openAuth("register")}
                color="#8B5CF6"
              >
                Get started
              </RaisedButton>
            </div>
          </div>
        </nav>

        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden px-6 pb-28 pt-24 md:pb-36 md:pt-32">
          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-20 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
            }}
          />

          <div className="mx-auto max-w-2xl text-center">
            <h1
              className="text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl"
              style={{ color: "#1A1A2E" }}
            >
              Give your best posts
              <br />a second life.
            </h1>

            <p
              className="mx-auto mt-6 max-w-lg text-base font-normal leading-relaxed"
              style={{ color: "#6B6B7B" }}
            >
              Schedule to Twitter/X, LinkedIn, and Bluesky. Set a like
              threshold&nbsp;— Flapr auto-replies with your CTA the moment your
              post takes off.
            </p>

            <div
              className="mx-auto mt-8 flex items-center justify-center gap-5"
              style={{ color: "#9B9BA5" }}
            >
              <i className="devicon-twitter-original text-lg" />
              <i className="devicon-linkedin-plain text-lg" />
              <span className="text-sm font-normal">Bluesky</span>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <RaisedButton
                onClick={() => openAuth("register")}
                size="lg"
                color="#8B5CF6"
                className="px-7"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </RaisedButton>
              <p className="text-xs font-normal" style={{ color: "#9B9BA5" }}>
                No credit card required · Free plan available
              </p>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section id="how-it-works" className="px-6 pb-28 md:pb-36">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <p
                className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "#8B5CF6" }}
              >
                How it works
              </p>
              <h2
                className="text-2xl font-medium tracking-tight md:text-3xl"
                style={{ color: "#1A1A2E" }}
              >
                How Flapr Works
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="rounded-xl border p-8 transition-colors hover:border-[#D4CFC6]"
                  style={{
                    background: "#F2EFE9",
                    borderColor: "#E5E0D8",
                  }}
                >
                  <span
                    className="text-xs font-medium tracking-[0.15em]"
                    style={{ color: "#8B5CF6" }}
                  >
                    {step.num}
                  </span>
                  <h3
                    className="mt-4 text-base font-medium"
                    style={{ color: "#1A1A2E" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-2 text-sm font-normal leading-relaxed"
                    style={{ color: "#6B6B7B" }}
                  >
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SOCIAL PROOF ─── */}
        <section className="px-6 pb-28 md:pb-36">
          <div className="mx-auto max-w-2xl">
            <div
              className="border-l-2 py-1 pl-8"
              style={{ borderColor: "#8B5CF6" }}
            >
              <p
                className="text-lg font-normal leading-relaxed md:text-xl"
                style={{ color: "#3D3D50" }}
              >
                &ldquo;Scheduled a thread on a Friday, went hiking all weekend.
                Came back to 4&nbsp;sales from the auto-plug. Zero effort.&rdquo;
              </p>
              <div className="mt-5">
                <p
                  className="text-sm font-medium"
                  style={{ color: "#1A1A2E" }}
                >
                  Sarah Chen
                </p>
                <p
                  className="text-sm font-normal"
                  style={{ color: "#6B6B7B" }}
                >
                  Indie maker · 12K followers on 𝕏
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRICING ─── */}
        <section id="pricing" className="px-6 pb-28 md:pb-36">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <p
                className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "#8B5CF6" }}
              >
                Pricing
              </p>
              <h2
                className="text-2xl font-medium tracking-tight md:text-3xl"
                style={{ color: "#1A1A2E" }}
              >
                Simple, transparent pricing
              </h2>
              <p
                className="mx-auto mt-3 max-w-md text-sm font-normal"
                style={{ color: "#6B6B7B" }}
              >
                Start free, upgrade when you&apos;re ready. No hidden fees, cancel
                anytime.
              </p>
            </div>

            <div className="grid items-start gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    "relative rounded-xl border p-8 transition-colors",
                    plan.highlighted && "md:scale-[1.02]"
                  )}
                  style={{
                    borderColor: plan.highlighted ? "#8B5CF6" : "#E5E0D8",
                    background: "#F2EFE9",
                  }}
                >
                  {plan.highlighted && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[11px] font-medium text-white"
                      style={{ background: "#8B5CF6" }}
                    >
                      Popular
                    </div>
                  )}

                  <p
                    className="text-xs font-medium uppercase tracking-[0.15em]"
                    style={{
                      color: plan.highlighted ? "#8B5CF6" : "#6B6B7B",
                    }}
                  >
                    {plan.name}
                  </p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span
                      className="text-3xl font-medium"
                      style={{ color: "#1A1A2E" }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="text-sm font-normal"
                      style={{ color: "#6B6B7B" }}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm font-normal"
                        style={{ color: "#3D3D50" }}
                      >
                        <Check
                          className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                          style={{
                            color: plan.highlighted ? "#8B5CF6" : "#8B5CF6",
                          }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.highlighted ? (
                    <RaisedButton
                      onClick={() => openAuth("register")}
                      color="#8B5CF6"
                      className="mt-8 w-full"
                    >
                      {plan.price === "$0" ? "Get started" : `Choose ${plan.name}`}
                    </RaisedButton>
                  ) : (
                    <button
                      onClick={() => openAuth("register")}
                      className="mt-8 block w-full rounded-lg border py-2.5 text-center text-sm font-medium transition-colors hover:border-[#D4CFC6]"
                      style={{ borderColor: "#E5E0D8", color: "#3D3D50" }}
                    >
                      {plan.price === "$0" ? "Get started" : `Choose ${plan.name}`}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="px-6 pb-28 md:pb-36">
          <div className="mx-auto max-w-3xl">
            <div className="mb-16 text-center">
              <h2
                className="text-2xl font-medium tracking-tight md:text-3xl"
                style={{ color: "#1A1A2E" }}
              >
                Frequently asked questions
              </h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  q: "Is there a free trial?",
                  a: "Yes! You can start on the Free plan which includes 10 posts per month. No credit card required.",
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Absolutely. You can downgrade to the Free plan or cancel your subscription at any time from your dashboard.",
                },
                {
                  q: "How does the auto-plug work?",
                  a: "You set a 'like threshold' (e.g., 50 likes). Flapr monitors your post, and once it hits that number, it automatically replies with your pre-written plug. It's like having a viral marketing assistant.",
                },
                {
                  q: "Which platforms do you support?",
                  a: "Currently, we support Twitter/X, LinkedIn, and Bluesky. We're actively working on adding Threads and Instagram.",
                },
              ].map((faq, i) => (
                <div key={i} className="border-b pb-8 last:border-0" style={{ borderColor: "#E5E0D8" }}>
                  <h3 className="text-lg font-medium" style={{ color: "#1A1A2E" }}>
                    {faq.q}
                  </h3>
                  <p className="mt-3 text-base font-normal leading-relaxed" style={{ color: "#6B6B7B" }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="border-t px-6 py-10" style={{ borderColor: "#E5E0D8" }}>
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
            <span
              className="text-sm font-medium tracking-tight"
              style={{ color: "#8B5CF6" }}
            >
              Flapr
            </span>

            <div className="flex items-center gap-6">
              <a
                href="#how-it-works"
                className="text-xs font-normal transition-opacity hover:opacity-100"
                style={{ color: "#6B6B7B", opacity: 0.8 }}
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="text-xs font-normal transition-opacity hover:opacity-100"
                style={{ color: "#6B6B7B", opacity: 0.8 }}
              >
                Pricing
              </a>
              <button
                onClick={() => openAuth("login")}
                className="text-xs font-normal transition-opacity hover:opacity-100"
                style={{ color: "#6B6B7B", opacity: 0.8 }}
              >
                Log in
              </button>
            </div>

            <div className="flex items-center gap-4">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9B9BA5" }} className="transition-opacity hover:opacity-80">
                <i className="devicon-twitter-original text-sm" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9B9BA5" }} className="transition-opacity hover:opacity-80">
                <i className="devicon-linkedin-plain text-sm" />
              </a>
              <span className="text-xs font-normal" style={{ color: "#9B9BA5" }}>
                © 2026 Flapr
              </span>
            </div>
          </div>
        </footer>
      </div>

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
