"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { features, C } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

/* ── Desktop: Interactive Feature Explorer ──────────────────── */

function FeatureExplorer() {
    const [active, setActive] = useState(0);
    const current = features[active];

    return (
        <div className="hidden md:flex gap-0 rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
            {/* Left nav — feature list */}
            <div
                className="w-[280px] lg:w-[320px] shrink-0 flex flex-col"
                style={{ backgroundColor: C.surface }}
            >
                {features.map((feature, i) => {
                    const isActive = i === active;
                    const num = String(i + 1).padStart(2, "0");

                    return (
                        <button
                            key={feature.title}
                            onClick={() => setActive(i)}
                            className={cn(
                                "group relative flex items-center gap-4 px-6 py-5 text-left transition-colors duration-200 cursor-pointer",
                                i !== features.length - 1 && "border-b",
                            )}
                            style={{
                                borderColor: C.border,
                                backgroundColor: isActive ? C.surfaceHover : "transparent",
                            }}
                        >
                            {/* Active indicator bar */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeFeatureBar"
                                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                                    style={{ backgroundColor: C.accent }}
                                    transition={spring}
                                />
                            )}

                            {/* Number */}
                            <span
                                className="text-[11px] font-mono font-medium tracking-wider shrink-0 transition-colors duration-200"
                                style={{ color: isActive ? C.accent : C.textMuted }}
                            >
                                {num}
                            </span>

                            {/* Icon + Title */}
                            <div className="flex items-center gap-2.5 min-w-0">
                                <feature.icon
                                    className="h-4 w-4 shrink-0 transition-colors duration-200"
                                    style={{ color: isActive ? C.accent : C.textMuted }}
                                    strokeWidth={1.75}
                                />
                                <span
                                    className="text-sm font-medium truncate transition-colors duration-200"
                                    style={{ color: isActive ? C.text : C.textSoft }}
                                >
                                    {feature.title}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Right panel — feature detail */}
            <div
                className="flex-1 relative min-h-[340px] flex items-center"
                style={{ backgroundColor: C.bg }}
            >
                {/* Accent gradient background */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        background: `radial-gradient(ellipse at 30% 50%, ${C.accent} 0%, transparent 70%)`,
                    }}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, x: 20, filter: "blur(6px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -20, filter: "blur(6px)" }}
                        transition={{ duration: 0.35, ease: EASE_OUT }}
                        className="relative z-10 px-10 lg:px-14 py-12"
                    >
                        {/* Large icon */}
                        <div
                            className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl"
                            style={{ backgroundColor: C.accentSoft }}
                        >
                            <current.icon
                                className="h-7 w-7"
                                style={{ color: C.accent }}
                                strokeWidth={1.75}
                            />
                        </div>

                        {/* Title */}
                        <h3
                            className="text-2xl lg:text-3xl font-semibold tracking-tight mb-4"
                            style={{ color: C.text }}
                        >
                            {current.title}
                        </h3>

                        {/* Description */}
                        <p
                            className="text-base leading-relaxed max-w-lg"
                            style={{ color: C.textSoft }}
                        >
                            {current.desc}
                        </p>

                        {/* Decorative accent line */}
                        <motion.div
                            className="mt-8 h-px w-16"
                            style={{ backgroundColor: C.accent }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT }}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ── Mobile: Accordion-style stacked features ───────────────── */

function MobileFeatureItem({ feature, index }: { feature: typeof features[number]; index: number }) {
    const [open, setOpen] = useState(index === 0);
    const num = String(index + 1).padStart(2, "0");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: EASE_OUT }}
            className="border-b last:border-b-0"
            style={{ borderColor: C.border }}
        >
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center gap-4 py-5 text-left cursor-pointer"
            >
                {/* Number */}
                <span
                    className="text-[11px] font-mono font-medium tracking-wider shrink-0"
                    style={{ color: open ? C.accent : C.textMuted }}
                >
                    {num}
                </span>

                {/* Icon */}
                <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200"
                    style={{ backgroundColor: open ? C.accentSoft : C.surface }}
                >
                    <feature.icon
                        className="h-4 w-4"
                        style={{ color: open ? C.accent : C.textMuted }}
                        strokeWidth={1.75}
                    />
                </div>

                {/* Title */}
                <span
                    className="flex-1 text-sm font-medium transition-colors duration-200"
                    style={{ color: open ? C.text : C.textSoft }}
                >
                    {feature.title}
                </span>

                {/* Toggle indicator */}
                <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={spring}
                    className="text-lg shrink-0 leading-none"
                    style={{ color: C.textMuted }}
                >
                    +
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                        className="overflow-hidden"
                    >
                        <p
                            className="pb-5 pl-[calc(11px+1rem+36px+1rem)] pr-4 text-sm leading-relaxed"
                            style={{ color: C.textSoft }}
                        >
                            {feature.desc}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ── Main Section ───────────────────────────────────────────── */

export function Features() {
    return (
        <section id="features" className="py-20 md:py-28">
            {/* Editorial header */}
            <div className="mb-14">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="flex items-center gap-3 mb-5"
                >
                    <div className="w-8 h-px" style={{ backgroundColor: C.accent }} />
                    <span
                        className="text-[11px] font-medium tracking-widest uppercase"
                        style={{ color: C.textMuted }}
                    >
                        Features
                    </span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT }}
                    className="font-serif font-medium tracking-tight leading-[1.1]"
                    style={{
                        color: C.text,
                        fontSize: "clamp(28px, 4vw, 40px)",
                    }}
                >
                    Built for growth.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }}
                    className="mt-3 max-w-md text-sm leading-relaxed"
                    style={{ color: C.textSoft }}
                >
                    Everything you need to schedule, engage, and convert — all on autopilot.
                </motion.p>
            </div>

            {/* Desktop: Interactive explorer */}
            <motion.div
                initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
            >
                <FeatureExplorer />
            </motion.div>

            {/* Mobile: Accordion */}
            <div
                className="md:hidden rounded-xl border"
                style={{ borderColor: C.border, backgroundColor: C.surface }}
            >
                <div className="px-4">
                    {features.map((feature, i) => (
                        <MobileFeatureItem key={feature.title} feature={feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
