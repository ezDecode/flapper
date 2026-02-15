"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { faqs, C } from "@/lib/landing-data";

const FAQItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                duration: 0.45,
                delay: index * 0.07,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
        >
            <motion.div
                animate={{
                    backgroundColor: isOpen
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0)",
                    borderColor: isOpen ? C.border : "transparent",
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden rounded-2xl border"
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="group flex w-full items-center justify-between px-6 py-5 text-left"
                >
                    <span
                        className="text-lg font-medium transition-colors duration-200"
                        style={{ color: isOpen ? C.accent : C.text }}
                    >
                        {q}
                    </span>

                    {/* Animated icon container */}
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="relative ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        style={{
                            backgroundColor: isOpen
                                ? `${C.accent}22`
                                : "rgba(255,255,255,0.05)",
                        }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isOpen ? (
                                <motion.span
                                    key="minus"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Minus className="h-4 w-4" style={{ color: C.accent }} />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="plus"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Plus className="h-4 w-4" style={{ color: C.textSoft }} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </button>

                {/* Animated answer panel */}
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            key="answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                height: { duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] },
                                opacity: { duration: 0.25, ease: "easeInOut" },
                            }}
                            className="overflow-hidden"
                        >
                            {/* Subtle divider line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                exit={{ scaleX: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="mx-6 origin-left"
                                style={{
                                    height: "1px",
                                    backgroundColor: C.border,
                                    opacity: 0.5,
                                }}
                            />
                            <motion.p
                                initial={{ y: -8 }}
                                animate={{ y: 0 }}
                                exit={{ y: -8 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="px-6 pb-6 pt-4 text-base leading-relaxed font-normal"
                                style={{ color: C.textSoft }}
                            >
                                {a}
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export function FAQ() {
    return (
        <section className="px-4 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-3xl">
                {/* Heading with entrance animation */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="mb-12 text-center text-[clamp(2rem,4vw,2.5rem)] font-medium tracking-tight leading-tight"
                    style={{ color: C.text }}
                >
                    Common Questions
                </motion.h2>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} index={i} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    );
}
