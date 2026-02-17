"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { features, C } from "@/lib/landing-data";

const INTERVAL = 4000;

export function Features() {
    const [active, setActive] = useState(0);
    const [progress, setProgress] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        setProgress(0);

        const startTime = Date.now();
        const frame = () => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(elapsed / INTERVAL, 1);
            setProgress(pct);
            if (pct < 1) {
                rafId = requestAnimationFrame(frame);
            } else {
                setActive((prev) => (prev + 1) % features.length);
            }
        };
        let rafId = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(rafId);
    }, [active, paused]);

    const goTo = useCallback((i: number) => {
        setActive(i);
        setProgress(0);
    }, []);

    const current = features[active];
    const Icon = current.icon;

    return (
        <section id="features" className="py-12 md:py-20">
            {/* Header */}
            <div className="mb-12 text-center">
                <div
                    className="mx-auto mb-4 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide uppercase"
                    style={{
                        borderColor: `rgba(0, 204, 85, 0.2)`,
                        color: C.accent,
                        background: C.accentSoft,
                    }}
                >
                    Features
                </div>
                <h2
                    className="text-3xl md:text-4xl font-medium tracking-[-0.02em] leading-[1.1]"
                    style={{ color: C.text }}
                >
                    Everything you need to grow.
                </h2>
                <p
                    className="mx-auto mt-4 max-w-md text-base font-normal leading-relaxed"
                    style={{ color: C.textSoft }}
                >
                    Powerful tools designed to help you schedule, engage, and
                    convert — all on autopilot.
                </p>
            </div>

            {/* Spotlight Card */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative rounded-2xl border overflow-hidden"
                style={{
                    borderColor: C.border,
                    background: C.surface,
                }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div className="relative min-h-[220px] p-8 md:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="flex flex-col items-center text-center gap-5"
                        >
                            <motion.div
                                initial={{ scale: 0.6 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 20,
                                    delay: 0.05,
                                }}
                                className="flex h-14 w-14 items-center justify-center rounded-xl"
                                style={{
                                    background: C.accentSoft,
                                }}
                            >
                                <Icon
                                    className="h-7 w-7"
                                    style={{ color: C.accent }}
                                />
                            </motion.div>

                            <h3
                                className="text-xl font-medium tracking-tight"
                                style={{ color: C.text }}
                            >
                                {current.title}
                            </h3>

                            <p
                                className="max-w-sm text-sm leading-relaxed"
                                style={{ color: C.textSoft }}
                            >
                                {current.desc}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Indicator row */}
                <div className="flex items-center justify-center gap-2 pb-6">
                    {features.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className="relative h-1.5 cursor-pointer rounded-full overflow-hidden transition-all duration-300"
                            style={{
                                width: i === active ? 32 : 12,
                                background:
                                    i === active
                                        ? C.border
                                        : C.surfaceHover,
                            }}
                            aria-label={`Go to feature ${i + 1}`}
                        >
                            {i === active && (
                                <motion.div
                                    className="absolute inset-y-0 left-0 rounded-full"
                                    style={{
                                        background: C.accent,
                                        width: `${progress * 100}%`,
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
