"use client";

import { motion } from "motion/react";
import { features, C } from "@/lib/landing-data";

export function Features() {
    return (
        <section id="features" className="px-4 py-24 md:px-8 md:py-32">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <div
                        className="mx-auto mb-4 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide uppercase"
                        style={{
                            borderColor: C.accent,
                            color: C.accent,
                            background: C.accentSoft,
                        }}
                    >
                        Features
                    </div>
                    <h2
                        className="text-[clamp(2.25rem,5vw,3rem)] font-medium tracking-tight leading-[1.05]"
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

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const isFullWidth =
                            feature.className === "md:col-span-3";

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{
                                    opacity: 0,
                                    y: 24,
                                    filter: "blur(6px)",
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                    ease: "easeOut",
                                }}
                                className={`group relative rounded-xl p-8 transition-all duration-300 hover:-translate-y-0.5 ${feature.className}`}
                                style={{
                                    background: isFullWidth
                                        ? "transparent"
                                        : `linear-gradient(135deg, ${C.surfaceHover} 0%, ${C.surface} 100%)`,
                                    border: isFullWidth
                                        ? "none"
                                        : `1px solid ${C.border}`,
                                }}
                                onMouseEnter={(e) => {
                                    if (!isFullWidth) {
                                        e.currentTarget.style.borderColor =
                                            C.textMuted;
                                        e.currentTarget.style.background = `linear-gradient(135deg, ${C.surfaceHover} 0%, ${C.surfaceHover} 100%)`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isFullWidth) {
                                        e.currentTarget.style.borderColor =
                                            C.border;
                                        e.currentTarget.style.background = `linear-gradient(135deg, ${C.surfaceHover} 0%, ${C.surface} 100%)`;
                                    }
                                }}
                            >
                                {/* Gradient border for full-width card */}
                                {isFullWidth && (
                                    <div
                                        className="pointer-events-none absolute inset-0 rounded-xl"
                                        style={{
                                            padding: "1px",
                                            background: `linear-gradient(135deg, ${C.accent}, ${C.warm}, ${C.accent})`,
                                            WebkitMask:
                                                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                            WebkitMaskComposite:
                                                "xor",
                                            maskComposite: "exclude",
                                        }}
                                    />
                                )}
                                {isFullWidth && (
                                    <div
                                        className="pointer-events-none absolute inset-[1px] rounded-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${C.surfaceHover} 0%, ${C.surface} 100%)`,
                                        }}
                                    />
                                )}

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div
                                        className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-shadow duration-300 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                                        style={{
                                            background: C.accentSoft,
                                        }}
                                    >
                                        <Icon
                                            className="h-5 w-5"
                                            style={{ color: C.accent }}
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="mb-2 text-lg font-medium"
                                        style={{ color: C.text }}
                                    >
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{ color: C.textSoft }}
                                    >
                                        {feature.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
