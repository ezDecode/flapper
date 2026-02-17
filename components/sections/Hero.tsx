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

// ─── Simple Notification Pill ─────────────────────────────────────

function SimpleWorkflow() {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % steps.length);
        }, 3500); // Slower cycle for readability
        return () => clearInterval(timer);
    }, [isHovered]);

    const currentStep = steps[index];
    const Icon = STEP_ICONS[index];

    return (
        <div 
            className="mt-16 flex justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                layout
                className="relative flex items-center gap-4 rounded-full border border-white/5 bg-[#111]/80 px-2 py-2 pr-8 backdrop-blur-md shadow-2xl transition-colors hover:border-white/10 hover:bg-[#161616]"
                style={{ 
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 8px 32px -8px rgba(0,0,0,0.5)" 
                }}
            >
                {/* Icon Circle */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1A1A] border border-white/5 overflow-hidden">
                     <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={index}
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <Icon className="h-5 w-5 text-[#F5F5F5]" />
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Subtle Progress Ring */}
                    {!isHovered && (
                        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48">
                            <motion.circle
                                key={index}
                                cx="24"
                                cy="24"
                                r="23"
                                fill="none"
                                stroke={C.accent}
                                strokeWidth="2"
                                strokeDasharray="144.5" // 2 * PI * 23
                                strokeDashoffset="144.5"
                                initial={{ strokeDashoffset: 144.5 }}
                                animate={{ strokeDashoffset: 0 }}
                                transition={{ duration: 3.5, ease: "linear" }}
                                className="opacity-80 drop-shadow-[0_0_2px_rgba(0,204,85,0.5)]"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-start justify-center h-10 overflow-hidden text-left min-w-[200px]">
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={index}
                            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.8 }}
                            className="flex flex-col"
                        >
                            <span className="text-sm font-medium text-[#F5F5F5] leading-tight">
                                {currentStep.title}
                            </span>
                            <span className="text-xs text-[#888] leading-tight mt-0.5">
                                {currentStep.description}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
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
                className="max-w-4xl font-medium tracking-[-0.03em] leading-[1.05]"
                style={{
                    fontSize: "clamp(40px, 8vw, 76px)", // Fluid scaling from mobile to large screens
                }}
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

            {/* Simple Workflow Pill */}
            <motion.div {...fadeUp(0.32)} className="w-full px-4">
                <SimpleWorkflow />
            </motion.div>
        </section>
    );
}
