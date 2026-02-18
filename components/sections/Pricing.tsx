"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Shield, Sparkles } from "lucide-react";

import { plans, C } from "@/lib/landing-data";

interface PricingProps {
    onOpenAuth: (tab: "login" | "register") => void;
}

const ANNUAL_DISCOUNT = 0.8;
const EASE_OUT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

function getPrice(base: string, isAnnual: boolean): string {
    const num = parseInt(base.replace("$", ""), 10);
    if (num === 0) return "$0";
    if (isAnnual) return `$${Math.round(num * ANNUAL_DISCOUNT)}`;
    return base;
}

function getPeriod(period: string, isAnnual: boolean): string {
    if (period === "forever") return "forever";
    return isAnnual ? "/ mo, billed yearly" : "/ month";
}

export function Pricing({ onOpenAuth }: PricingProps) {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section id="pricing" className="py-16 md:py-24">
            {/* Editorial header */}
            <div className="mb-10 md:mb-14">
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
            <div className="mb-10 md:mb-14 flex items-center justify-center gap-3">
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
                    className="relative h-[30px] w-[52px] cursor-pointer rounded-full transition-all duration-[400ms]"
                    style={{
                        background: isAnnual ? C.accent : C.surfaceHover,
                        border: `1.5px solid ${isAnnual ? "transparent" : C.border}`,
                    }}
                >
                    <motion.div
                        className="absolute top-1/2 h-[24px] w-[24px] -translate-y-1/2 rounded-full shadow-sm"
                        style={{
                            background: isAnnual ? "white" : C.text,
                        }}
                        animate={{
                            left: isAnnual
                                ? "calc(100% - 24px - 3px)"
                                : "3px",
                        }}
                        transition={spring}
                    />
                </button>
                <span
                    className="relative text-sm font-medium transition-colors duration-200"
                    style={{ color: isAnnual ? C.text : C.textMuted }}
                >
                    Annual
                    <AnimatePresence>
                        {isAnnual && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8, x: -4 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -4 }}
                                transition={spring}
                                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                                style={{
                                    color: C.accent,
                                    backgroundColor: C.accentSoft,
                                }}
                            >
                                −20%
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
                                filter: "blur(3px)",
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                            }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.55,
                                delay: i * 0.12,
                                ease: EASE_OUT,
                            }}
                            className="group relative flex flex-col overflow-hidden rounded-2xl"
                            style={{
                                backgroundColor: C.surface,
                            }}
                        >
                            {/* Border */}
                            <div
                                className="absolute inset-0 rounded-2xl pointer-events-none"
                                style={{
                                    border: `1px solid ${isPro ? C.accent : C.border}`,
                                    borderRadius: "inherit",
                                }}
                            />

                            <div
                                className={`relative flex flex-1 flex-col p-7 md:p-8 ${isPro ? "pt-6 md:pt-7" : ""}`}
                            >
                                {/* Header: Plan name + badge */}
                                <div className="flex items-center gap-3 mb-6">
                                    <h3
                                        className="text-xs font-semibold tracking-widest uppercase"
                                        style={{
                                            color: isPro
                                                ? C.accent
                                                : C.textMuted,
                                        }}
                                    >
                                        {plan.name}
                                    </h3>
                                    {isPro && (
                                        <span
                                            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                                            style={{
                                                backgroundColor: C.accentSoft,
                                                color: C.accent,
                                            }}
                                        >
                                            <Sparkles
                                                className="h-3 w-3"
                                                strokeWidth={2}
                                            />
                                            Popular
                                        </span>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-2 overflow-hidden">
                                    <AnimatePresence mode="popLayout">
                                        <motion.span
                                            key={displayPrice}
                                            className="font-semibold tracking-tight"
                                            style={{
                                                color: C.text,
                                                fontSize:
                                                    "clamp(32px, 5vw, 44px)",
                                                lineHeight: 1,
                                            }}
                                            initial={{
                                                y: 14,
                                                opacity: 0,
                                                filter: "blur(4px)",
                                            }}
                                            animate={{
                                                y: 0,
                                                opacity: 1,
                                                filter: "blur(0px)",
                                            }}
                                            exit={{
                                                y: -14,
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
                                    className="mt-3 text-sm leading-relaxed"
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
                                <ul className="mb-8 flex-1 space-y-4">
                                    {plan.features.map((f) => (
                                        <li
                                            key={f}
                                            className="flex items-start gap-3 text-sm leading-snug"
                                            style={{ color: C.textSoft }}
                                        >
                                            <div
                                                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                                                style={{
                                                    backgroundColor:
                                                        C.accentSoft,
                                                }}
                                            >
                                                <Check
                                                    className="h-3 w-3"
                                                    style={{
                                                        color: C.accent,
                                                    }}
                                                    strokeWidth={2.5}
                                                />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <motion.button
                                    onClick={() => onOpenAuth("register")}
                                    whileHover={{}}
                                    whileTap={{}}
                                    transition={spring}
                                    className="relative w-full cursor-pointer rounded-full h-[52px] px-5 text-[15px] font-semibold transition-all duration-200 flex items-center justify-center overflow-hidden"
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
                                    onMouseEnter={(e) => {
                                        if (!isPro) {
                                            e.currentTarget.style.backgroundColor =
                                                "rgba(255,255,255,0.05)";
                                            e.currentTarget.style.borderColor =
                                                C.textMuted;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isPro) {
                                            e.currentTarget.style.backgroundColor =
                                                "transparent";
                                            e.currentTarget.style.borderColor =
                                                C.border;
                                        }
                                    }}
                                >
                                    {plan.cta}
                                </motion.button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer note */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, ease: EASE_OUT }}
                className="mt-12 flex items-center justify-center gap-2 text-sm"
                style={{ color: C.textMuted }}
            >
                <Shield className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>
                    All plans include SSL encryption &amp; 99.9% uptime SLA.
                </span>
            </motion.div>
        </section>
    );
}
