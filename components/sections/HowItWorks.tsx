"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { steps, C } from "@/lib/landing-data";

export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Smooth out the scroll progress
    const scrollProgress = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <section
            id="how-it-works"
            ref={containerRef}
            className="relative"
            style={{ height: "300vh" }} // Tall height to allow scrolling
        >
            <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4 md:px-8">
                <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:gap-24">
                    {/* ─── Left: Title & Static Info ─── */}
                    <div className="flex flex-col justify-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="text-[clamp(2.5rem,5vw,4rem)] font-medium tracking-tight leading-[1] md:leading-[1.05]"
                            style={{ color: C.text }}
                        >
                            Three steps.
                            <br />
                            <span style={{ color: C.textMuted }}>
                                Zero friction.
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: 0.1,
                            }}
                            className="mt-6 max-w-md text-lg font-normal leading-relaxed"
                            style={{ color: C.textSoft }}
                        >
                            Stop gluing together Zapier, Buffer, and makeshift
                            scripts. Flapr handles the entire lifecycle of a
                            viral post in one cohesive workflow.
                        </motion.p>
                    </div>

/* ─── Right: Interactive Steps ─── */
                    <div className="relative flex min-h-[400px] w-full items-center justify-center">
                        {/* Progress Bar (Vertical) */}
                        <div className="absolute -left-6 top-10 bottom-10 w-0.5 rounded-full bg-white/5 md:-left-12">
                            <motion.div
                                className="w-full origin-top rounded-full"
                                style={{
                                    height: "100%",
                                    background: C.accent,
                                    scaleY: scrollProgress,
                                }}
                            />
                        </div>

                        {steps.map((step, index) => (
                            <StepItem
                                key={index}
                                step={step}
                                index={index}
                                total={steps.length}
                                progress={scrollProgress}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function StepItem({
    step,
    index,
    total,
    progress,
}: {
    step: (typeof steps)[0];
    index: number;
    total: number;
    progress: any;
}) {
    // Determine active range for this step
    // Each step gets a segment of the scroll
    const start = index / total;
    const end = (index + 1) / total;

    // Opacity: Fade in when entering start, fade out when leaving end
    const opacity = useTransform(
        progress,
        [start, start + 0.1, end - 0.1, end],
        [0, 1, 1, 0]
    );

    // Scale: Subtle zoom in
    const scale = useTransform(
        progress,
        [start, start + 0.1, end - 0.1, end],
        [0.8, 1, 1, 0.8]
    );
    
    // Y Position: Slide up slightly
    const y = useTransform(
        progress,
        [start, end],
        [50, -50]
    );

    // Filter blur
    const filter = useTransform(
        progress,
         [start, start + 0.1, end - 0.1, end],
        ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]
    );

    return (
        <motion.div
            style={{
                opacity,
                scale,
                filter,
                y,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
            }}
            className="rounded-3xl border p-8 md:p-10"
        >
             <div
                className="absolute inset-0 rounded-3xl"
                style={{
                    background: C.surface,
                    borderColor: C.border,
                    borderWidth: 1, 
                }}
             />

            <div className="relative z-10">
                <span
                    className="mb-4 block text-xs font-medium uppercase tracking-wider"
                    style={{ color: C.accent }}
                >
                    Step {step.num}
                </span>

                <h3
                    className="mb-4 text-3xl font-medium md:text-4xl"
                    style={{ color: C.text }}
                >
                    {step.title}
                </h3>

                <p
                    className="text-lg font-normal leading-relaxed text-pretty"
                    style={{ color: C.textSoft }}
                >
                     {step.description.replace(/—/g, "-")}
                </p>
            </div>
        </motion.div>
    );
}
