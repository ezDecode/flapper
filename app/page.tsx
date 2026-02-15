"use client";

import Link from "next/link";
import {
  Button,
  Card,
  Text,
  H1,
  H2,
  Flex,
  Pill,
  Box,
  Anchor,
  Blockquote,
} from "@maximeheckel/design-system";
import { Zap, Target, Rocket, Check, ArrowRight, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Zap,
    label: "Step 1",
    title: "Schedule your post",
    description:
      "Write once, queue across Twitter/X, LinkedIn, and Bluesky. Pick your time or let Flapr choose the best slot.",
  },
  {
    icon: Target,
    label: "Step 2",
    title: "Set your trigger",
    description:
      "Choose a like threshold — 50, 200, 1,000 — whatever signals your post is taking off.",
  },
  {
    icon: Rocket,
    label: "Step 3",
    title: "Auto-plug fires",
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
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      {/* ─── NAV ─── */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "#E8E8E4",
          background: "rgba(250, 250, 248, 0.85)",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Flame className="h-6 w-6" style={{ color: "#F76707" }} />
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "#1A1A1A" }}
            >
              Flapr
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "#6B6B6B" }}
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "#6B6B6B" }}
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5"
              style={{ color: "#1A1A1A" }}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors"
              style={{ background: "#F76707" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#E8590C")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#F76707")
              }
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        {/* Subtle background gradient orb */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(247,103,7,0.15) 0%, transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{ borderColor: "#E8E8E4", background: "white" }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: "#2B8A3E" }}
            />
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: "#6B6B6B" }}
            >
              Now in public beta
            </span>
          </div>

          <h1
            className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
            style={{ color: "#1A1A1A" }}
          >
            Post it. Set it.
            <br />
            <span style={{ color: "#F76707" }}>Flapr does the rest.</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed md:text-xl"
            style={{ color: "#6B6B6B" }}
          >
            Schedule to Twitter/X, LinkedIn, and Bluesky. Set a like
            threshold&nbsp;— Flapr auto-replies with your CTA the moment your
            post blows up.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all"
              style={{
                background: "#F76707",
                boxShadow: "0 4px 24px rgba(247, 103, 7, 0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E8590C";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#F76707";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 text-base font-medium transition-colors hover:bg-black/[0.03]"
              style={{ borderColor: "#E8E8E4", color: "#1A1A1A" }}
            >
              See how it works
            </Link>
          </div>

          <p
            className="mt-5 text-xs"
            style={{ color: "#6B6B6B" }}
          >
            No credit card required · Free plan available
          </p>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#F76707" }}
            >
              How it works
            </p>
            <h2
              className="text-3xl font-bold tracking-tight md:text-4xl"
              style={{ color: "#1A1A1A" }}
            >
              Three steps to autopilot
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Card key={step.title} depth={1} className="relative">
                  <Card.Body>
                    <div className="p-2">
                      <div
                        className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{
                          background: "rgba(247, 103, 7, 0.08)",
                          color: "#F76707",
                        }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <p
                        className="mb-1.5 text-xs font-bold uppercase tracking-widest"
                        style={{ color: "#F76707" }}
                      >
                        {step.label}
                      </p>

                      <Text as="h3" size="2" weight="4">
                        {step.title}
                      </Text>

                      <Text
                        as="p"
                        size="2"
                        variant="tertiary"
                        className="mt-2"
                      >
                        {step.description}
                      </Text>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="rounded-2xl border p-10 md:p-14"
            style={{
              borderColor: "#E8E8E4",
              background: "white",
            }}
          >
            <div
              className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full text-2xl"
              style={{ background: "rgba(247, 103, 7, 0.08)" }}
            >
              ✦
            </div>

            <blockquote
              className="text-xl font-medium leading-relaxed md:text-2xl"
              style={{ color: "#1A1A1A" }}
            >
              &ldquo;Scheduled a thread on a Friday, went hiking all weekend.
              Came back to 4&nbsp;sales from the auto&#8209;plug. Zero
              effort.&rdquo;
            </blockquote>

            <div className="mt-6">
              <p
                className="text-sm font-semibold"
                style={{ color: "#1A1A1A" }}
              >
                Sarah Chen
              </p>
              <p className="text-sm" style={{ color: "#6B6B6B" }}>
                Indie maker · 12K followers on 𝕏
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#F76707" }}
            >
              Pricing
            </p>
            <h2
              className="text-3xl font-bold tracking-tight md:text-4xl"
              style={{ color: "#1A1A1A" }}
            >
              Simple, transparent pricing
            </h2>
            <p
              className="mx-auto mt-3 max-w-md text-base"
              style={{ color: "#6B6B6B" }}
            >
              Start free, upgrade when you&apos;re ready. No hidden fees, cancel
              anytime.
            </p>
          </div>

          <div className="grid items-start gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl border p-8 transition-all",
                  plan.highlighted
                    ? "scale-[1.03] shadow-xl md:scale-105"
                    : "hover:shadow-md"
                )}
                style={{
                  borderColor: plan.highlighted ? "#F76707" : "#E8E8E4",
                  background: "white",
                }}
              >
                {plan.highlighted && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                    style={{ background: "#F76707" }}
                  >
                    Most popular
                  </div>
                )}

                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{
                    color: plan.highlighted ? "#F76707" : "#6B6B6B",
                  }}
                >
                  {plan.name}
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className="text-4xl font-extrabold"
                    style={{ color: "#1A1A1A" }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#6B6B6B" }}
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: "#1A1A1A" }}
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 flex-shrink-0"
                        style={{
                          color: plan.highlighted ? "#F76707" : "#2B8A3E",
                        }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={cn(
                    "mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors",
                    plan.highlighted
                      ? "text-white"
                      : "border hover:bg-black/[0.03]"
                  )}
                  style={
                    plan.highlighted
                      ? {
                          background: "#F76707",
                        }
                      : {
                          borderColor: "#E8E8E4",
                          color: "#1A1A1A",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (plan.highlighted)
                      e.currentTarget.style.background = "#E8590C";
                  }}
                  onMouseLeave={(e) => {
                    if (plan.highlighted)
                      e.currentTarget.style.background = "#F76707";
                  }}
                >
                  {plan.price === "$0" ? "Get started" : `Choose ${plan.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="border-t px-6 py-12"
        style={{ borderColor: "#E8E8E4" }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5" style={{ color: "#F76707" }} />
            <span
              className="text-base font-bold tracking-tight"
              style={{ color: "#1A1A1A" }}
            >
              Flapr
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className="text-sm transition-colors hover:opacity-70"
              style={{ color: "#6B6B6B" }}
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-sm transition-colors hover:opacity-70"
              style={{ color: "#6B6B6B" }}
            >
              Pricing
            </a>
            <Link
              href="/login"
              className="text-sm transition-colors hover:opacity-70"
              style={{ color: "#6B6B6B" }}
            >
              Log in
            </Link>
          </div>

          <p className="text-xs" style={{ color: "#6B6B6B" }}>
            © 2026 Flapr. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
