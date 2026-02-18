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
                color: C.textMuted,
            }}
        >
            <XIcon className="w-full h-full" />
        </span>
    );
}

// ─── Easing curves (Emil Kowalski) ─────────────────────────────
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const spring = { type: "spring" as const, stiffness: 200, damping: 25 };

// ─── Step icons ────────────────────────────────────────────────
const STEP_ICONS = [PenTool, Zap, Rocket];

// ─── Horizontal Stepper ────────────────────────────────────────
function WorkflowStepper() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % steps.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="mt-14 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
                {steps.map((step, i) => {
                    const Icon = STEP_ICONS[i];
                    const isActive = i === active;
                    return (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className="relative flex flex-col items-start gap-2 p-5 text-left transition-colors duration-200 cursor-pointer hover:bg-white/[0.03]"
                            style={{
                                backgroundColor: isActive ? C.surface : "transparent",
                            }}
                        >
                            <div className="flex items-center gap-2.5">
                                <Icon
                                    className="h-4 w-4 shrink-0"
                                    style={{ color: isActive ? C.accent : C.textMuted }}
                                    strokeWidth={1.5}
                                />
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: isActive ? C.text : C.textMuted }}
                                >
                                    {step.title}
                                </span>
                            </div>
                            <p
                                className="text-[13px] leading-relaxed"
                                style={{ color: isActive ? C.textSoft : C.textMuted }}
                            >
                                {step.description}
                            </p>

                            {/* Progress bar */}
                            {isActive && (
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-[2px] origin-left z-10"
                                    style={{ backgroundColor: C.accent }}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    key={active}
                                    transition={{ duration: 3, ease: "linear" }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Headline word-by-word reveal ──────────────────────────────
function AnimatedLine({
    children,
    delay = 0,
    style,
    className = "",
}: {
    children: string;
    delay?: number;
    style?: React.CSSProperties;
    className?: string;
}) {
    const words = children.split(" ");
    return (
        <span className={className} style={style}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                    }}
                    transition={{
                        ...spring,
                        delay: delay + i * 0.05,
                    }}
                >
                    {word}
                    {i < words.length - 1 ? "\u00A0" : ""}
                </motion.span>
            ))}
        </span>
    );
}

interface HeroProps {
    onOpenAuth: (tab: "login" | "register") => void;
}

export function Hero({ onOpenAuth }: HeroProps) {
    return (
        <section className="relative flex flex-col items-center justify-center pt-24 pb-8 text-center md:pt-32 md:pb-12 overflow-hidden">
            {/* Announcement line */}
            <motion.div
                initial={{ opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="mb-8 md:mb-12 flex items-center gap-4 w-full max-w-[280px] sm:max-w-xs"
            >
                <div className="h-px flex-1" style={{ backgroundColor: C.border }} />
                <span
                    className="flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase whitespace-nowrap"
                    style={{ color: C.textMuted }}
                >
                    <PlatformCycler />
                    Public beta
                </span>
                <div className="h-px flex-1" style={{ backgroundColor: C.border }} />
            </motion.div>

            {/* Headline */}
            <h1
                className="max-w-4xl font-serif font-medium tracking-[-0.03em] leading-[1.05]"
                style={{ fontSize: "clamp(32px, 6vw, 56px)" }}
            >
                <AnimatedLine delay={0.1} style={{ color: C.text }}>
                    Engage smarter.
                </AnimatedLine>
                <br />
                <AnimatedLine delay={0.25} style={{ color: C.textMuted }}>
                    Convert on
                </AnimatedLine>{" "}
                <AnimatedLine delay={0.35} style={{ color: C.accent }}>
                    autopilot.
                </AnimatedLine>
            </h1>

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: EASE_OUT }}
                className="mt-8 md:mt-12 flex flex-row items-center justify-start gap-3 sm:gap-4"
            >
                <motion.button
                    onClick={() => onOpenAuth("register")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-6 text-sm font-medium cursor-pointer"
                    style={{
                        background: C.accent,
                        color: "hsl(var(--primary-foreground))",
                    }}
                >
                    Start for free
                    <ArrowRight className="h-4 w-4" />
                </motion.button>

                <motion.a
                    href="#features"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    className="group inline-flex h-10 items-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors duration-200 hover:bg-white/5"
                    style={{ borderColor: C.border, color: C.textSoft }}
                >
                    See features
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </motion.a>
            </motion.div>

            {/* Workflow Stepper */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: EASE_OUT }}
                className="w-full"
            >
                <WorkflowStepper />
            </motion.div>
        </section>
    );
}
