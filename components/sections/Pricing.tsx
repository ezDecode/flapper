"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

import { plans, C } from "@/lib/landing-data";

interface PricingProps {
    onOpenAuth: (tab: "login" | "register") => void;
}

const ANNUAL_DISCOUNT = 0.8;
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

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
        <section id="pricing" className="py-20 md:py-28">
            {/* Editorial header */}
            <div className="mb-14">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="flex items-center gap-3 mb-5"
                >
                    <div
                        className="w-8 h-px"
                        style={{ backgroundColor: C.accent }}
                    />
                    <span
                        className="text-[11px] font-medium tracking-widest uppercase"
                        style={{ color: C.textMuted }}
                    >
                        Pricing
                    </span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT }}
                    className="font-serif font-medium tracking-[-0.02em] leading-[1.1]"
                    style={{
                        color: C.text,
                        fontSize: "clamp(24px, 4vw, 36px)",
                    }}
                >
                    Simple, transparent pricing
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }}
                    className="mt-3 max-w-md text-sm leading-relaxed"
                    style={{ color: C.textSoft }}
                >
                    Start free — no credit card needed. Upgrade only when Flapr
                    proves its value.
                </motion.p>
            </div>

            {/* Billing toggle */}
            <div className="mb-12 flex items-center justify-center gap-3">
                <span
                    className="text-sm font-medium transition-colors duration-200"
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
                    <motion.div
                        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full"
                        style={{ background: isAnnual ? "white" : C.text }}
                        animate={{
                            left: isAnnual
                                ? "calc(100% - 1.25rem - 2px)"
                                : "2px",
                        }}
                        transition={spring}
                    />
                </button>
                <span
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: isAnnual ? C.text : C.textMuted }}
                >
                    Annual
                    <AnimatePresence>
                        {isAnnual && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={spring}
                                className="ml-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium"
                                style={{
                                    color: C.accent,
                                    backgroundColor: C.accentSoft,
                                }}
                            >
                                save 20%
                            </motion.span>
                        )}
                    </AnimatePresence>
                </span>
            </div>

            {/* Cards */}
            <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
                {plans.map((plan, i) => {
                    const isPro = plan.highlighted;
                    const displayPrice = getPrice(plan.price, isAnnual);
                    const displayPeriod = getPeriod(plan.period, isAnnual);

                    return (
                        <motion.div
                            key={plan.name}
                            initial={{
                                opacity: 0,
                                y: 24,
                                filter: "blur(4px)",
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                            }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.5,
                                delay: i * 0.1,
                                ease: EASE_OUT,
                            }}
                            className="relative flex flex-col overflow-hidden rounded-2xl border"
                            style={{
                                borderColor: isPro ? C.accent : C.border,
                                backgroundColor: C.surface,
                                boxShadow: isPro
                                    ? `0 0 0 1px ${C.accent}, 0 8px 32px -8px hsla(var(--primary) / 0.12)`
                                    : undefined,
                            }}
                        >
                            {/* Accent top bar for Pro */}
                            {isPro && (
                                <div
                                    className="h-1"
                                    style={{
                                        background: `linear-gradient(90deg, ${C.accent}, ${C.accentHover})`,
                                    }}
                                />
                            )}

                            {/* Most popular badge */}
                            {isPro && (
                                <div
                                    className="mx-6 mt-6 md:mx-8 md:mt-8 mb-0 w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
                                    style={{
                                        backgroundColor: C.accentSoft,
                                        color: C.accent,
                                    }}
                                >
                                    Most popular
                                </div>
                            )}

                            <div
                                className={`flex flex-1 flex-col p-6 md:p-8 ${isPro ? "pt-4 md:pt-4" : ""}`}
                            >
                                {/* Plan name */}
                                <h3
                                    className="text-xs font-medium tracking-widest uppercase"
                                    style={{
                                        color: isPro ? C.accent : C.textMuted,
                                    }}
                                >
                                    {plan.name}
                                </h3>

                                {/* Price */}
                                <div className="mt-5 flex items-baseline gap-1.5">
                                    <AnimatePresence mode="popLayout">
                                        <motion.span
                                            key={displayPrice}
                                            className="font-semibold tracking-tight"
                                            style={{
                                                color: C.text,
                                                fontSize:
                                                    "clamp(32px, 5vw, 40px)",
                                                lineHeight: 1,
                                            }}
                                            initial={{
                                                y: 12,
                                                opacity: 0,
                                                filter: "blur(4px)",
                                            }}
                                            animate={{
                                                y: 0,
                                                opacity: 1,
                                                filter: "blur(0px)",
                                            }}
                                            exit={{
                                                y: -12,
                                                opacity: 0,
                                                filter: "blur(4px)",
                                            }}
                                            transition={spring}
                                        >
                                            {displayPrice}
                                        </motion.span>
                                    </AnimatePresence>
                                    <span
                                        className="text-sm"
                                        style={{ color: C.textMuted }}
                                    >
                                        {displayPeriod}
                                    </span>
                                </div>

                                {/* Description */}
                                <p
                                    className="mt-2 text-sm leading-relaxed"
                                    style={{ color: C.textSoft }}
                                >
                                    {plan.desc}
                                </p>

                                {/* Divider */}
                                <div
                                    className="my-6 h-px w-full"
                                    style={{ background: C.border }}
                                />

                                {/* Features */}
                                <ul className="mb-8 flex-1 space-y-3">
                                    {plan.features.map((f) => (
                                        <li
                                            key={f}
                                            className="flex items-start gap-3 text-sm leading-snug"
                                            style={{ color: C.textSoft }}
                                        >
                                            <Check
                                                className="mt-0.5 h-4 w-4 shrink-0"
                                                style={{ color: C.accent }}
                                                strokeWidth={2}
                                            />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <motion.button
                                    onClick={() => onOpenAuth("register")}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={spring}
                                    className="w-full cursor-pointer rounded-full px-4 py-3 text-sm font-medium transition-colors duration-200"
                                    style={
                                        isPro
                                            ? {
                                                  background: C.accent,
                                                  color: "hsl(var(--primary-foreground))",
                                              }
                                            : {
                                                  background: "transparent",
                                                  border: `1px solid ${C.border}`,
                                                  color: C.textSoft,
                                              }
                                    }
                                >
                                    {plan.cta}
                                </motion.button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer note */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, ease: EASE_OUT }}
                className="mt-10 text-center text-sm"
                style={{ color: C.textMuted }}
            >
                All plans include SSL encryption &amp; 99.9% uptime SLA.
            </motion.p>
        </section>
    );
}
