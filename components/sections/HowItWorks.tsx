"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { steps, C } from "@/lib/landing-data";

export function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="relative overflow-hidden py-28 md:py-36"
            style={{
                background: C.bgAlt,
            }}
        >
            <div className="mx-auto max-w-[1080px] px-6 md:px-8">
                {/* Section Header */}
                <div className="mb-16 md:mb-20 max-w-2xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl lg:text-[40px] font-semibold tracking-[-0.02em] mb-5"
                    >
                        <span style={{ color: C.text }}>Three steps.</span>{" "}
                        <span style={{ color: C.textMuted }}>Zero friction.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-base md:text-lg leading-relaxed max-w-xl"
                        style={{ color: C.textSoft }}
                    >
                        From draft to conversion — one seamless workflow.
                        No more stitching together half a dozen tools.
                    </motion.p>
                </div>

                {/* Connecting Line */}
                <motion.div
                    className="hidden md:block h-px origin-left"
                    style={{
                        background: `linear-gradient(90deg, #00AA45, rgba(0,170,69,0.3), transparent)`,
                    }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />

                {/* Bento Grid */}
                <div
                    className="grid grid-cols-1 md:grid-cols-3 border"
                    style={{ borderColor: C.border }}
                >
                    {steps.map((step, index) => (
                        <StepCard
                            key={step.num}
                            step={step}
                            index={index}
                            isLast={index === steps.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function StepCard({
    step,
    index,
    isLast,
}: {
    step: (typeof steps)[0];
    index: number;
    isLast: boolean;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
                duration: 0.6,
                delay: 0.15 + index * 0.12,
                ease: "easeOut",
            }}
            whileHover={{ y: -2, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="relative flex flex-col gap-8 p-6 md:p-8 lg:p-10"
            style={{
                borderRight: isLast ? "none" : `1px solid ${C.border}`,
                borderBottom: isLast ? "none" : undefined,
                background: hovered ? C.surfaceHover : C.bgAlt,
                transition: "background 0.3s ease",
            }}
        >
            {/* Mobile connecting line */}
            <motion.div
                className="md:hidden absolute top-0 left-8 right-8 h-px origin-left"
                style={{
                    background: `linear-gradient(90deg, ${C.accent}, transparent)`,
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
            />

            {/* Mobile divider (bottom border for stacked cards) */}
            {!isLast && (
                <div
                    className="md:hidden absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: C.border }}
                />
            )}

            <div className="relative z-10 flex flex-col gap-6">
                {/* Step Number */}
                <span
                    className="inline-flex items-center justify-center w-12 h-12 text-sm font-mono font-medium tracking-wider"
                    style={{
                        border: `1.5px solid ${hovered ? C.accent : C.border}`,
                        color: hovered ? C.accent : C.textSoft,
                        boxShadow: hovered
                            ? "0 0 0 3px rgba(0,170,69,0.1)"
                            : "none",
                        transition: "border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
                    }}
                >
                    {step.num}
                </span>

                {/* Title */}
                <h3
                    className="text-xl font-semibold tracking-tight"
                    style={{ color: C.text }}
                >
                    {step.title}
                </h3>

                {/* Description */}
                <p
                    className="text-sm md:text-base leading-relaxed"
                    style={{ color: C.textSoft }}
                >
                    {step.description}
                </p>
            </div>
        </motion.div>
    );
}
