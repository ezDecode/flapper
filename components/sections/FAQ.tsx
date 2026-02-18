"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { faqs, C } from "@/lib/landing-data";

const EASE_OUT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

function FAQItem({
    q,
    a,
    index,
    isOpen,
    onToggle,
}: {
    q: string;
    a: string;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: EASE_OUT,
            }}
        >
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer min-h-[44px]"
            >
                <span
                    className="text-[15px] font-medium leading-snug transition-colors duration-[350ms] sm:text-[17px]"
                    style={{ color: isOpen ? C.text : C.text }}
                >
                    {q}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={spring}
                    className="flex h-8 w-8 shrink-0 items-center justify-center"
                >
                    <Plus
                        className="h-4 w-4"
                        style={{ color: isOpen ? C.accent : C.textMuted }}
                        strokeWidth={1.5}
                    />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: spring,
                            opacity: { duration: 0.2, ease: "easeInOut" },
                        }}
                        className="overflow-hidden"
                    >
                        <p
                            className="pb-6 text-[15px] leading-relaxed pr-10"
                            style={{ color: C.textSoft }}
                        >
                            {a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Divider */}
            <div className={`h-px w-full ${isOpen ? '' : ''}`} style={{ backgroundColor: C.border }} />
        </motion.div>
    );
}

export function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section id="faq" className="py-16 md:py-24">
            <div>
                {/* Editorial header */}
                <div className="mb-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                        className="flex items-center gap-3 mb-5"
                    >
                        <div className="w-8 h-px" style={{ backgroundColor: C.accent }} />
                        <span
                            className="text-[11px] font-medium tracking-widest uppercase"
                            style={{ color: C.textMuted }}
                        >
                            FAQ
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT }}
                        className="font-serif font-medium tracking-[-0.02em]"
                        style={{
                            color: C.text,
                            fontSize: "clamp(24px, 4vw, 36px)",
                        }}
                    >
                        Common questions
                    </motion.h2>
                </div>

                {/* Top divider */}
                <div className="h-px w-full" style={{ backgroundColor: C.border }} />

                {/* Items */}
                <div>
                    {faqs.map((faq, i) => (
                        <FAQItem
                            key={i}
                            index={i}
                            isOpen={activeIndex === i}
                            onToggle={() => handleToggle(i)}
                            {...faq}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
