"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { faqs, C } from "@/lib/landing-data";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const FAQItem = ({
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
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
        >
            <motion.div
                animate={{
                    backgroundColor: isOpen ? C.surface : "transparent",
                    borderColor: isOpen ? C.border : "transparent",
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden rounded-xl border"
            >
                <button
                    onClick={onToggle}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                    <span
                        className="text-[15px] font-medium leading-snug transition-colors duration-200 sm:text-base"
                        style={{ color: isOpen ? C.accent : C.text }}
                    >
                        {q}
                    </span>

                    <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={spring}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        style={{
                            backgroundColor: isOpen ? C.accentSoft : C.surfaceHover,
                        }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isOpen ? (
                                <motion.span
                                    key="minus"
                                    initial={{ opacity: 0, scale: 0.4 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.4 }}
                                    transition={{ duration: 0.12 }}
                                    className="flex items-center justify-center"
                                >
                                    <Minus
                                        className="h-3.5 w-3.5"
                                        style={{ color: C.accent }}
                                    />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="plus"
                                    initial={{ opacity: 0, scale: 0.4 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.4 }}
                                    transition={{ duration: 0.12 }}
                                    className="flex items-center justify-center"
                                >
                                    <Plus
                                        className="h-3.5 w-3.5"
                                        style={{ color: C.textSoft }}
                                    />
                                </motion.span>
                            )}
                        </AnimatePresence>
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
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                exit={{ scaleX: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="mx-5 origin-left"
                                style={{
                                    height: "1px",
                                    backgroundColor: C.border,
                                }}
                            />
                            <motion.p
                                initial={{ y: -6 }}
                                animate={{ y: 0 }}
                                exit={{ y: -6 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="px-5 pb-5 pt-3.5 text-sm leading-relaxed sm:text-[15px] sm:leading-7"
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
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section className="px-4 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-2xl">
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="mb-10 text-center text-3xl font-semibold tracking-tight sm:text-4xl"
                    style={{ color: C.text }}
                >
                    Common questions
                </motion.h2>

                <div className="space-y-2">
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
