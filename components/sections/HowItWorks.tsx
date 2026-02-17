"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { steps, C } from "@/lib/landing-data";

const STEP_DURATION = 3500;

export function HowItWorks() {
    const [active, setActive] = useState(0);
    const [progress, setProgress] = useState(0);
    const [paused, setPaused] = useState(false);

    // Auto-advance with progress
    useEffect(() => {
        if (paused) return;
        setProgress(0);
        const start = Date.now();
        let raf: number;

        const tick = () => {
            const elapsed = Date.now() - start;
            const pct = Math.min(elapsed / STEP_DURATION, 1);
            setProgress(pct);
            if (pct < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                setActive((p) => (p + 1) % steps.length);
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [active, paused]);

    const goTo = useCallback((i: number) => {
        setActive(i);
        setProgress(0);
    }, []);

    return (
        <section id="how-it-works" className="py-12 md:py-20">
            <div>
                {/* Header */}
                <div className="mb-12 max-w-2xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] mb-4"
                    >
                        <span style={{ color: C.text }}>Three steps.</span>{" "}
                        <span style={{ color: C.textMuted }}>
                            Zero friction.
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-base md:text-lg leading-relaxed max-w-xl mx-auto"
                        style={{ color: C.textSoft }}
                    >
                        From draft to conversion — one seamless workflow.
                    </motion.p>
                </div>

                {/* Stepper */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-0"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    {steps.map((step, i) => {
                        const isActive = i === active;
                        const isDone =
                            i < active || (i === active && progress === 1);

                        return (
                            <button
                                key={step.num}
                                onClick={() => goTo(i)}
                                className="relative text-left cursor-pointer transition-all duration-300"
                                style={{
                                    borderBottom:
                                        i < steps.length - 1
                                            ? `1px solid ${C.border}`
                                            : "none",
                                }}
                            >
                                {/* Progress fill background */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 origin-left"
                                        style={{
                                            background: C.accentSoft,
                                            scaleX: progress,
                                            transformOrigin: "left",
                                        }}
                                    />
                                )}

                                <div
                                    className="relative flex items-start gap-5 px-5 md:px-6 transition-all duration-300"
                                    style={{
                                        paddingTop: isActive ? 24 : 16,
                                        paddingBottom: isActive ? 24 : 16,
                                    }}
                                >
                                    {/* Step indicator */}
                                    <div className="shrink-0 pt-0.5">
                                        <div
                                            className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-mono font-bold transition-all duration-300"
                                            style={{
                                                background: isActive
                                                    ? C.accent
                                                    : isDone
                                                      ? C.accent
                                                      : "transparent",
                                                color:
                                                    isActive || isDone
                                                        ? "#fff"
                                                        : C.textMuted,
                                                border:
                                                    isActive || isDone
                                                        ? "none"
                                                        : `1.5px solid ${C.border}`,
                                                boxShadow: isActive
                                                    ? "0 0 12px rgba(0,170,69,0.2)"
                                                    : "none",
                                            }}
                                        >
                                            {isDone && !isActive ? (
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M2 6L5 9L10 3"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : (
                                                step.num
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className="text-base font-semibold tracking-tight transition-colors duration-200"
                                            style={{
                                                color: isActive
                                                    ? C.text
                                                    : C.textMuted,
                                            }}
                                        >
                                            {step.title}
                                        </h3>

                                        <AnimatePresence initial={false}>
                                            {isActive && (
                                                <motion.p
                                                    initial={{
                                                        height: 0,
                                                        opacity: 0,
                                                        marginTop: 0,
                                                    }}
                                                    animate={{
                                                        height: "auto",
                                                        opacity: 1,
                                                        marginTop: 8,
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                        opacity: 0,
                                                        marginTop: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.25,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="text-sm leading-relaxed overflow-hidden"
                                                    style={{
                                                        color: C.textSoft,
                                                    }}
                                                >
                                                    {step.description}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
