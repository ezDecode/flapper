"use client";

import { motion } from "motion/react";
import {
    Clock,
    Zap,
    BarChart3,
    MessageSquare,
    Shield,
    Sparkles,
    ArrowUpRight,
} from "lucide-react";
import { features, C } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

// ─── Bento Grid Feature Card ─────────────────────────────────────

const cardVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

// ─── Micro Visuals for each card ──────────────────────────────────

function SchedulingVisual() {
    return (
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
            {/* Subtle dot grid */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: "20px 20px",
                }}
            />
            {/* Timeline bars */}
            <div className="relative flex items-end gap-1.5 px-6">
                {[
                    { h: 24, delay: 0 },
                    { h: 40, delay: 0.1 },
                    { h: 32, delay: 0.2 },
                    { h: 56, delay: 0.3 },
                    { h: 44, delay: 0.4 },
                    { h: 64, delay: 0.5 },
                    { h: 36, delay: 0.6 },
                ].map((bar, i) => (
                    <motion.div
                        key={i}
                        className="w-4 rounded-t-sm"
                        style={{ backgroundColor: i === 5 ? C.accent : C.surfaceHover }}
                        initial={{ height: 0 }}
                        whileInView={{ height: bar.h }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            delay: bar.delay,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    />
                ))}
            </div>
            {/* Highlight line */}
            <motion.div
                className="absolute bottom-6 left-6 right-6 h-px"
                style={{
                    background: `linear-gradient(to right, transparent, ${C.accentSoft}, transparent)`,
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            />
        </div>
    );
}

function AutoPlugVisual() {
    return (
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
            {/* Center pulse */}
            <div className="relative">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center relative z-10"
                    style={{
                        backgroundColor: C.surfaceHover,
                        boxShadow: `0 0 30px ${C.accentSoft}`,
                    }}
                >
                    <Zap className="w-5 h-5" style={{ color: C.accent }} strokeWidth={1.5} />
                </div>
                {/* Ripple rings */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-xl border"
                        style={{ borderColor: C.accent }}
                        initial={{ scale: 1, opacity: 0.4 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.7,
                            ease: "easeOut",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function AnalyticsVisual() {
    return (
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden px-6">
            {/* Ascending metric line */}
            <svg className="w-full h-20" viewBox="0 0 200 60" fill="none">
                <motion.path
                    d="M0 50 Q30 48 50 40 T100 25 T150 15 T200 5"
                    stroke={C.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.path
                    d="M0 50 Q30 48 50 40 T100 25 T150 15 T200 5 V60 H0 Z"
                    fill={`url(#gradient)`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.accent} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            {/* Metric dot */}
            <motion.div
                className="absolute right-8 top-6 w-2 h-2 rounded-full"
                style={{ backgroundColor: C.accent, boxShadow: `0 0 8px ${C.accent}` }}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}

function TemplatesVisual() {
    return (
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
            {/* Stacked cards */}
            {[2, 1, 0].map((i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-lg border p-3 flex flex-col gap-1.5"
                    style={{
                        width: 120,
                        height: 72,
                        backgroundColor: i === 0 ? C.surface : C.bgAlt,
                        borderColor: i === 0 ? C.border : C.borderSubtle,
                    }}
                    initial={{ y: 0, scale: 0.9, opacity: 0 }}
                    whileInView={{
                        y: i * -8,
                        x: i * 4,
                        scale: 1 - i * 0.04,
                        opacity: 1 - i * 0.25,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (2 - i) * 0.1 }}
                >
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: C.surfaceHover }} />
                        <div className="w-10 h-1 rounded-full" style={{ backgroundColor: C.surfaceHover }} />
                    </div>
                    <div className="w-full h-1 rounded-full" style={{ backgroundColor: C.accentSoft }} />
                    <div className="w-3/4 h-1 rounded-full" style={{ backgroundColor: C.accentSoft, opacity: 0.5 }} />
                </motion.div>
            ))}
        </div>
    );
}

function TwitterVisual() {
    return (
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
            {/* X logo */}
            <motion.svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10"
                style={{ color: C.textMuted }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </motion.svg>
            {/* Orbit dots */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: C.accent }}
                    animate={{
                        x: [0, Math.cos((i * 2 * Math.PI) / 3) * 40],
                        y: [0, Math.sin((i * 2 * Math.PI) / 3) * 40],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 1,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

const VISUALS = [
    SchedulingVisual,
    AutoPlugVisual,
    AnalyticsVisual,
    TemplatesVisual,
    TwitterVisual,
];

// ─── Feature Card ─────────────────────────────────────────────────

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
    const Visual = VISUALS[index];
    const isWide = feature.className?.includes("col-span-2");
    const isFull = feature.className?.includes("col-span-3");

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className={cn(
                "group relative flex flex-col rounded-2xl border overflow-hidden transition-colors duration-300",
                isFull ? "md:col-span-3" : isWide ? "md:col-span-2" : "md:col-span-1",
            )}
            style={{
                backgroundColor: C.surface,
                borderColor: C.border,
            }}
            whileHover={{
                borderColor: C.accent,
                transition: { duration: 0.3 },
            }}
        >
            {/* Visual area */}
            <div
                className="relative h-[140px] w-full flex items-center justify-center overflow-hidden"
                style={{
                    background: `linear-gradient(180deg, ${C.bgAlt} 0%, ${C.surface} 100%)`,
                }}
            >
                {Visual && <Visual />}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5 pt-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-300"
                            style={{ backgroundColor: C.accentSoft }}
                        >
                            <feature.icon
                                className="h-3.5 w-3.5"
                                style={{ color: C.accent }}
                                strokeWidth={1.5}
                            />
                        </div>
                        <h3
                            className="text-sm font-medium"
                            style={{ color: C.text }}
                        >
                            {feature.title}
                        </h3>
                    </div>
                    <ArrowUpRight
                        className="h-3.5 w-3.5 opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
                        style={{ color: C.accent }}
                        strokeWidth={1.5}
                    />
                </div>
                <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: C.textSoft }}
                >
                    {feature.desc}
                </p>
            </div>

            {/* Hover glow */}
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${C.accentSoft} 0%, transparent 70%)`,
                }}
            />
        </motion.div>
    );
}

// ─── Features Section ─────────────────────────────────────────────

export function Features() {
    return (
        <section id="features" className="py-16 md:py-24">
            {/* Header */}
            <div className="mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-wider uppercase"
                    style={{
                        borderColor: C.border,
                        color: C.textMuted,
                    }}
                >
                    <Sparkles className="h-3 w-3" style={{ color: C.accent }} />
                    Power Tools
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
                    transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mt-3 max-w-md text-sm leading-relaxed"
                    style={{ color: C.textSoft }}
                >
                    Everything you need to schedule, engage, and convert — all on autopilot.
                </motion.p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {features.map((feature, i) => (
                    <FeatureCard key={i} feature={feature} index={i} />
                ))}
            </div>
        </section>
    );
}
