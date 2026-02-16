"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Clock, Zap, BarChart3, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { C } from "@/lib/landing-data";

// Inline SVGs to avoid extra icon component dependencies
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
        { text: "Smart Scheduling", icon: Clock },
        { text: "Auto-Plug Engine", icon: Zap },
        { text: "Analytics & Insights", icon: BarChart3 },
        { text: "Growth Tools", icon: TrendingUp },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % badges.length);
        }, 2200);
        return () => clearInterval(timer);
    }, []);

    const CurrentIcon = badges[index].icon;

    return (
        <div className="mt-8 flex items-center gap-3">
            <span className="text-base font-medium" style={{ color: C.textSoft }}>
                Powering
            </span>
            <div className="relative h-8 w-64 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center"
                    >
                        <span
                            className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm font-medium tracking-wide"
                            style={{
                                borderColor: "rgba(139, 92, 246, 0.2)",
                                backgroundColor: "rgba(139, 92, 246, 0.1)",
                                color: "#A78BFA",
                                boxShadow: "0 0 12px rgba(139, 92, 246, 0.1)",
                            }}
                        >
                            <CurrentIcon className="h-3.5 w-3.5" />
                            {badges[index].text}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Fade-up motion variant ───────────────────────────────────────────────────
const EASE = [0.19, 1, 0.22, 1] as const;

const fadeUp = () => ({
    initial: { opacity: 0, y: 20, filter: "blur(6px)" },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: EASE as unknown as [number, number, number, number],
        },
    },
});

interface HeroProps {
    onOpenAuth: (tab: "login" | "register") => void;
}

export function Hero({ onOpenAuth }: HeroProps) {
    return (
        <section className="relative flex flex-col items-start justify-center px-4 pt-40 pb-10 text-left md:px-8 md:pt-52 md:pb-16">
            {/* Badge */}
            <motion.div
                {...fadeUp()}
                className="mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-medium"
                style={{
                    borderColor: C.border,
                    color: C.textSoft,
                    background: C.surface,
                }}
            >
                <PlatformCycler />
                Now in public beta
            </motion.div>

            {/* Heading */}
            <h1 className="max-w-4xl text-[clamp(2.5rem,8vw,5rem)] font-medium tracking-tighter leading-[1.15] md:leading-[1.1]">
                Engage smarter.
                <br />
                <span style={{ color: C.textMuted }}>
                    Convert on autopilot.
                </span>
            </h1>

            {/* Rotating Feature Badge */}
            <RotatingBadge />



            {/* CTA */}
            <motion.div
                {...fadeUp()}
                className="mt-10 flex flex-row items-center justify-start gap-3 sm:gap-4"
            >
                <button
                    onClick={() => onOpenAuth("register")}
                    className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-sm font-medium sm:h-12 sm:px-8 sm:text-base transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90"
                    style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
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
