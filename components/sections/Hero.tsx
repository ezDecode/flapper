"use client";

import { useState, useEffect } from "react";
import { ArrowRight, PenTool, Zap, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { C, steps } from "@/lib/landing-data";

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
                color: "#666",
            }}
        >
            <XIcon className="w-full h-full" />
        </span>
    );
}

// ─── Merged Rotating Line ───────────────────────────────────────
// ─── Merged Rotating Line ───────────────────────────────────────
// ─── Merged Rotating Line ───────────────────────────────────────
// ─── Merged Rotating Line ───────────────────────────────────────
const INTERVAL = 3000;

// Map icons to steps (assuming 3 steps in order)
const STEP_ICONS = [PenTool, Zap, Rocket];

function SmoothText({ text }: { text: string }) {
    const letters = Array.from(text);

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.015, delayChildren: 0.1 },
        },
    };

    const child = {
        hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.div
            className="flex flex-wrap justify-center sm:justify-start" 
            variants={container}
            initial="hidden"
            animate="visible"
            key={text}
        >
            {letters.map((letter, index) => (
                <motion.span 
                    variants={child} 
                    key={index}
                    className="inline-block"
                >
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.div>
    );
}

function MergedStatusLine() {
    const [index, setIndex] = useState(0);
    const current = steps[index];
    const Icon = STEP_ICONS[index % STEP_ICONS.length];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((p) => (p + 1) % steps.length);
        }, INTERVAL);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="mt-12 w-full max-w-2xl px-6">
            <div className="relative flex flex-col items-center justify-center min-h-[32px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center"
                    >
                        {/* Description Text */}
                        <div className="text-sm font-normal text-[#A0A0A0]">
                            <SmoothText text={current.description} />
                        </div>

                        {/* Title Pill with Icon */}
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                transition: { 
                                    delay: 0.1, // Appear quickly
                                    duration: 0.4,
                                    ease: "easeOut"
                                }
                            }}
                            className="flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide uppercase whitespace-nowrap"
                            style={{
                                backgroundColor: C.accentSoft,
                                color: C.accent,
                                border: `1px solid ${C.accent}40`
                            }}
                        >
                            <Icon className="h-3 w-3" />
                            {current.title}
                        </motion.span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Staggered fade-up ─────────────────────────────────────
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
        <section className="relative flex flex-col items-center justify-center pt-24 pb-8 text-center md:pt-32 md:pb-12 overflow-hidden">
            {/* Badge pill */}
            <motion.div
                {...fadeUp(0)}
                className="mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wider uppercase"
                style={{
                    borderColor: "rgba(0, 204, 85, 0.2)",
                    color: C.accent,
                    background: "rgba(0, 204, 85, 0.06)",
                }}
            >
                <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: C.accent }} />
                    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: C.accent }} />
                </span>
                <PlatformCycler />
                Now in public beta
            </motion.div>

            {/* Headline */}
            <motion.h1
                {...fadeUp(0.08)}
                className="max-w-4xl text-5xl md:text-6xl lg:text-[64px] font-medium tracking-[-0.03em] leading-[1.05]"
            >
                <span style={{ color: C.text }}>
                    Engage smarter.
                </span>
                <br />
                <span style={{ color: C.textMuted }}>
                    Convert on{" "}
                </span>
                <span style={{ color: C.accent }}>
                    autopilot.
                </span>
            </motion.h1>

            {/* REMOVED: RotatingFeatureBadge (Powering...) */}

            {/* CTA Buttons */}
            <motion.div
                {...fadeUp(0.24)}
                className="mt-10 flex flex-row items-center justify-start gap-3 sm:gap-4"
            >
                <button
                    onClick={() => onOpenAuth("register")}
                    className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-6 text-sm font-medium transition-all cursor-pointer active:scale-[0.96]"
                    style={{
                        background: C.accent,
                        color: "#000",
                    }}
                >
                    Start for free
                    <ArrowRight className="h-4 w-4" />
                </button>

                <a
                    href="#features"
                    className="group inline-flex h-10 items-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors"
                    style={{ borderColor: C.border, color: C.textSoft }}
                >
                    See features
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
            </motion.div>

            {/* Merged How It Works Line */}
            <motion.div {...fadeUp(0.32)} className="w-full flex justify-center">
                <MergedStatusLine />
            </motion.div>
        </section>
    );
}
