"use client";

import { motion } from "motion/react";
import { features, C } from "@/lib/landing-data";

export function Features() {
    return (
        <section id="features" className="py-24 md:py-32">
            <div>
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
                        className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] leading-[1.1]"
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
                                className={`group relative rounded-xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-0.5 ${feature.className}`}
                                style={{
                                    background: "#FFFFFF",
                                    border: isFullWidth
                                        ? `1px solid ${C.accent}`
                                        : `1px solid ${C.border}`,
                                }}
                                onMouseEnter={(e) => {
                                    if (!isFullWidth) {
                                        e.currentTarget.style.borderColor =
                                            C.accent;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isFullWidth) {
                                        e.currentTarget.style.borderColor =
                                            C.border;
                                    }
                                }}
                            >
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div
                                        className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-shadow duration-300 group-hover:shadow-[0_0_12px_rgba(0,170,69,0.15)]"
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
                                        className="mb-2 text-lg font-semibold"
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
