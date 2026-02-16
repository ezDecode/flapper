"use client";

import { Check } from "lucide-react";

import { plans, C } from "@/lib/landing-data";

interface PricingProps {
    onOpenAuth: (tab: "login" | "register") => void;
}

export function Pricing({ onOpenAuth }: PricingProps) {
    return (
        <section id="pricing" className="px-4 py-20 md:px-8 md:py-24">
            <div className="mb-16 text-center">
                <h2
                    className="text-[clamp(2.25rem,5vw,3rem)] font-medium tracking-tight leading-[1.034]"
                    style={{ color: C.text }}
                >
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
                            position: "relative",
                        }}
                    >
                        {plan.highlighted && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-1 text-xs font-medium text-white shadow-lg shadow-indigo-500/25">
                                MOST POPULAR
                            </div>
                        )}
                        <h3 className="text-xl font-medium" style={{ color: C.text }}>
                            {plan.name}
                        </h3>
                        <div className="mt-4 mb-8 flex items-baseline">
                            <span className="text-4xl font-medium" style={{ color: C.text }}>
                                {plan.price}
                            </span>
                            <span
                                className="ml-1 text-sm font-normal"
                                style={{ color: C.textMuted }}
                            >
                                {plan.period}
                            </span>
                        </div>

                        <ul className="mb-8 flex-1 space-y-4">
                            {plan.features.map((f) => (
                                <li
                                    key={f}
                                    className="flex items-start gap-3 text-sm font-normal"
                                    style={{ color: C.textSoft }}
                                >
                                    <Check
                                        className="mt-0.5 h-4 w-4 shrink-0"
                                        style={{ color: C.accent }}
                                    />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        {plan.highlighted ? (
                            <button
                                onClick={() => onOpenAuth("register")}
                                className="inline-flex items-center justify-center gap-2 rounded-full w-full h-12 text-base font-medium transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90"
                                style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
                            >
                                {plan.cta}
                            </button>
                        ) : (
                            <button
                                onClick={() => onOpenAuth("register")}
                                className="h-12 w-full rounded-full border text-base font-medium transition-colors hover:bg-white/5"
                                style={{ borderColor: C.border, color: C.textSoft }}
                            >
                                {plan.cta}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
