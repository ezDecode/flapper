"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Clock, Zap, BarChart3, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { C } from "@/lib/landing-data";

// Inline SVG to avoid extra icon component dependencies
const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 1200 1226.37" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M714.163 519.284L1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284zM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854z" />
    </svg>
);

export function PlatformCycler() {
    return (
        <span
            className="inline-flex items-center justify-center align-middle"
            style={{
                width: "1.1em",
                height: "1.1em",
                verticalAlign: "middle",
                position: "relative",
                top: "-0.06em",
                color: "#e7e7e7",
            }}
        >
            <XIcon className="w-full h-full" />
        </span>
    );
}

function RotatingBadge() {
    const [index, setIndex] = useState(0);
    const badges = [
        { text: "Smart Scheduling", icon: Clock, color: "#10B981", bg: "rgba(16, 185, 129, 0.10)", border: "rgba(16, 185, 129, 0.20)" },
        { text: "Auto-Plug Engine", icon: Zap, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.10)", border: "rgba(245, 158, 11, 0.20)" },
        { text: "Analytics & Insights", icon: BarChart3, color: "#06B6D4", bg: "rgba(6, 182, 212, 0.10)", border: "rgba(6, 182, 212, 0.20)" },
        { text: "Growth Tools", icon: TrendingUp, color: "#F43F5E", bg: "rgba(244, 63, 94, 0.10)", border: "rgba(244, 63, 94, 0.20)" },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % badges.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    const current = badges[index];
    const CurrentIcon = current.icon;

    return (
        <div className="mt-8 flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: C.textMuted }}>
                Powering
            </span>
            <motion.div
                layout
                className="relative flex items-center justify-center overflow-hidden rounded-full border px-4 py-1.5"
                style={{
                    borderColor: current.border,
                    backgroundColor: current.bg,
                    color: current.color,
                    boxShadow: `0 0 16px ${current.bg}, 0 0 4px ${current.bg}`,
                }}
                transition={{
                    duration: 0.35,
                    ease: "easeInOut",
                    backgroundColor: { duration: 0.35 },
                    borderColor: { duration: 0.35 },
                    color: { duration: 0.35 },
                }}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, filter: "blur(4px)", y: 6 }}
                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        exit={{ opacity: 0, filter: "blur(4px)", y: -6 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex items-center gap-2 whitespace-nowrap text-sm font-medium tracking-wide"
                    >
                        <CurrentIcon className="h-3.5 w-3.5" />
                        <span>{current.text}</span>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

// ─── Staggered fade-up with blur dissolve ─────────────────────────────────────
const spring = { type: "spring", damping: 30, stiffness: 200 } as const;

const fadeUp = (delay: number = 0) => ({
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { ...spring, delay },
    },
    viewport: { once: true },
});

interface HeroProps {
    onOpenAuth: (tab: "login" | "register") => void;
}

export function Hero({ onOpenAuth }: HeroProps) {
    return (
        <section className="relative flex flex-col items-start justify-center px-4 pt-40 pb-10 text-left md:px-8 md:pt-52 md:pb-16 overflow-hidden">
            {/* ── Ambient glow ── */}
            <div
                className="pointer-events-none absolute -top-40 -right-40 h-[700px] w-[700px] md:h-[900px] md:w-[900px]"
                style={{
                    background:
                        "radial-gradient(circle at center, rgba(16, 185, 129, 0.07) 0%, rgba(16, 185, 129, 0.03) 35%, transparent 70%)",
                }}
                aria-hidden
            />

            {/* ── Badge pill ── */}
            <motion.div
                {...fadeUp(0)}
                className="mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-medium"
                style={{
                    borderColor: "rgba(16, 185, 129, 0.20)",
                    color: C.accent,
                    background: "rgba(16, 185, 129, 0.05)",
                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.08), inset 0 0 12px rgba(16, 185, 129, 0.04)",
                }}
            >
                <span
                    className="relative flex h-2 w-2"
                    aria-hidden
                >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: C.accent }} />
                    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: C.accent }} />
                </span>
                <PlatformCycler />
                Now in public beta
            </motion.div>

            {/* ── Headline ── */}
            <motion.h1
                {...fadeUp(0.08)}
                className="max-w-4xl text-[clamp(2.5rem,8vw,5rem)] font-semibold tracking-tighter leading-[1.1]"
            >
                <span
                    style={{
                        background: "linear-gradient(180deg, #FAFAFA 40%, #A1A1AA 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    Engage smarter.
                </span>
                <br />
                <span
                    style={{
                        background: "linear-gradient(180deg, #71717A 20%, #3F3F46 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    Convert on{" "}
                </span>
                <span
                    style={{
                        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    autopilot.
                </span>
            </motion.h1>

            {/* ── Rotating Feature Badge ── */}
            <motion.div {...fadeUp(0.16)}>
                <RotatingBadge />
            </motion.div>

            {/* ── CTA Buttons ── */}
            <motion.div
                {...fadeUp(0.24)}
                className="mt-10 flex flex-row items-center justify-start gap-3 sm:gap-4"
            >
                <button
                    onClick={() => onOpenAuth("register")}
                    className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-sm font-medium sm:h-12 sm:px-8 sm:text-base transition-all cursor-pointer active:scale-[0.96]"
                    style={{
                        background: "linear-gradient(135deg, #10B981, #059669)",
                        color: "#fff",
                        boxShadow: "0 0 24px rgba(16, 185, 129, 0.25), 0 0 8px rgba(16, 185, 129, 0.15)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                            "0 0 32px rgba(16, 185, 129, 0.35), 0 0 12px rgba(16, 185, 129, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                            "0 0 24px rgba(16, 185, 129, 0.25), 0 0 8px rgba(16, 185, 129, 0.15)";
                    }}
                >
                    Start for free
                    <ArrowRight className="h-4 w-4" />
                </button>

                <a
                    href="#how-it-works"
                    className="group inline-flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors hover:bg-white/5 sm:h-12 sm:px-8 sm:text-base"
                    style={{ borderColor: C.border, color: C.textSoft }}
                >
                    See how it works
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
            </motion.div>
        </section>
    );
}
