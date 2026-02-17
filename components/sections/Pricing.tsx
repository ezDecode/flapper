"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";

import { plans, C } from "@/lib/landing-data";

interface PricingProps {
    onOpenAuth: (tab: "login" | "register") => void;
}

const ANNUAL_DISCOUNT = 0.8; // 20% off

function getPrice(base: string, isAnnual: boolean): string {
    const num = parseInt(base.replace("$", ""), 10);
    if (num === 0) return "$0";
    if (isAnnual) return `$${Math.round(num * ANNUAL_DISCOUNT)}`;
    return base;
}

function getPeriod(period: string, isAnnual: boolean): string {
    if (period === "forever") return "forever";
    return isAnnual ? "/ month, billed yearly" : "/ month";
}

export function Pricing({ onOpenAuth }: PricingProps) {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section id="pricing" className="px-4 py-24 md:px-8 md:py-32">
            {/* Header */}
            <div className="mb-6 text-center">
                <div
                    className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide uppercase"
                    style={{
                        borderColor: C.accent,
                        color: C.accent,
                        background: C.accentSoft,
                    }}
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    Pricing
                </div>
                <h2
                    className="text-[clamp(2.25rem,5vw,3rem)] font-medium tracking-tight leading-[1.05]"
                    style={{ color: C.text }}
                >
                    Simple, transparent pricing
                </h2>
                <p
                    className="mx-auto mt-4 max-w-md text-base font-normal leading-relaxed"
                    style={{ color: C.textSoft }}
                >
                    Start free — no credit card needed. Upgrade only when Flapr proves its
                    value.
                </p>
            </div>

            {/* Monthly / Annual toggle */}
            <div className="mb-14 flex items-center justify-center gap-3">
                <span
                    className="text-sm font-medium"
                    style={{ color: isAnnual ? C.textMuted : C.text }}
                >
                    Monthly
                </span>
                <button
                    type="button"
                    aria-label="Toggle annual billing"
                    onClick={() => setIsAnnual((v) => !v)}
                    className="relative h-7 w-12 cursor-pointer rounded-full transition-colors duration-200"
                    style={{
                        background: isAnnual ? C.accent : C.surfaceHover,
                        border: `1px solid ${isAnnual ? C.accent : C.border}`,
                    }}
                >
                    <div
                        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition-all duration-200"
                        style={{
                            background: "#fff",
                            left: isAnnual ? "calc(100% - 1.25rem - 2px)" : "2px",
                        }}
                    />
                </button>
                <span
                    className="text-sm font-medium"
                    style={{ color: isAnnual ? C.text : C.textMuted }}
                >
                    Annual{" "}
                    <span
                        className="ml-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={{ background: C.accentSoft, color: C.accent }}
                    >
                        Save 20%
                    </span>
                </span>
            </div>

            {/* Cards */}
            <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
                {plans.map((plan) => {
                    const isPro = plan.highlighted;
                    const displayPrice = getPrice(plan.price, isAnnual);
                    const displayPeriod = getPeriod(plan.period, isAnnual);

                    return (
                        <div
                            key={plan.name}
                            className="relative flex flex-col rounded-2xl border p-8 transition-shadow duration-300"
                            style={{
                                background: isPro
                                    ? `linear-gradient(170deg, ${C.surfaceHover} 0%, ${C.surface} 100%)`
                                    : C.surface,
                                borderColor: isPro ? C.accent : C.border,
                                boxShadow: isPro
                                    ? `0 0 40px ${C.accentSoft}, 0 8px 32px rgba(0,0,0,.4)`
                                    : "0 2px 12px rgba(0,0,0,.2)",
                            }}
                        >
                            {/* Badge */}
                            {isPro && (
                                <div
                                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold tracking-wide uppercase shadow-lg"
                                    style={{
                                        background: `linear-gradient(135deg, ${C.accent}, #6D28D9)`,
                                        color: "#fff",
                                        boxShadow: `0 4px 14px ${C.accentSoft}`,
                                    }}
                                >
                                    Most popular
                                </div>
                            )}

                            {/* Plan name */}
                            <h3
                                className="text-sm font-semibold tracking-wide uppercase"
                                style={{ color: isPro ? C.accent : C.textMuted }}
                            >
                                {plan.name}
                            </h3>

                            {/* Price */}
                            <div className="mt-5 flex items-end gap-1">
                                <span
                                    className="text-5xl font-semibold tracking-tight"
                                    style={{ color: C.text }}
                                >
                                    {displayPrice}
                                </span>
                                <span
                                    className="mb-1.5 text-sm font-normal"
                                    style={{ color: C.textMuted }}
                                >
                                    {displayPeriod}
                                </span>
                            </div>

                            {/* Struck-through original price when annual */}
                            {isPro && isAnnual && (
                                <span
                                    className="mt-1 text-sm line-through"
                                    style={{ color: C.textMuted }}
                                >
                                    {plan.price}/mo
                                </span>
                            )}

                            {/* Description */}
                            <p
                                className="mt-2 text-sm font-normal leading-relaxed"
                                style={{ color: C.textSoft }}
                            >
                                {plan.desc}
                            </p>

                            {/* Divider */}
                            <div
                                className="my-7 h-px w-full"
                                style={{ background: C.border }}
                            />

                            {/* Features */}
                            <ul className="mb-8 flex-1 space-y-3.5">
                                {plan.features.map((f) => (
                                    <li
                                        key={f}
                                        className="flex items-start gap-3 text-sm font-normal leading-snug"
                                        style={{ color: C.textSoft }}
                                    >
                                        <span
                                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                background: isPro ? C.accentSoft : C.surfaceHover,
                                            }}
                                        >
                                            <Check
                                                className="h-3 w-3"
                                                style={{ color: isPro ? C.accent : C.textSoft }}
                                            />
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                onClick={() => onOpenAuth("register")}
                                className="inline-flex items-center justify-center rounded-xl w-full h-12 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-[0.97]"
                                style={
                                    isPro
                                        ? {
                                              background: `linear-gradient(135deg, ${C.accent}, #6D28D9)`,
                                              color: "#fff",
                                              boxShadow: `0 4px 20px ${C.accentSoft}`,
                                          }
                                        : {
                                              background: "transparent",
                                              border: `1px solid ${C.border}`,
                                              color: C.textSoft,
                                          }
                                }
                                onMouseEnter={(e) => {
                                    if (!isPro) e.currentTarget.style.borderColor = C.textMuted;
                                }}
                                onMouseLeave={(e) => {
                                    if (!isPro) e.currentTarget.style.borderColor = C.border;
                                }}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Footer note */}
            <p
                className="mt-10 text-center text-sm font-normal"
                style={{ color: C.textMuted }}
            >
                All plans include SSL encryption & 99.9% uptime SLA.
            </p>
        </section>
    );
}
