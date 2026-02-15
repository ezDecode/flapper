"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { faqs, C } from "@/lib/landing-data";

const FAQItem = ({ q, a }: { q: string; a: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div
            className={cn(
                "overflow-hidden rounded-2xl border transition-all duration-300",
                isOpen
                    ? "bg-white/5 border-white/10"
                    : "bg-transparent border-transparent hover:bg-white/[0.02]"
            )}
            style={{ borderColor: isOpen ? C.border : "transparent" }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
            >
                <span className="text-lg font-medium" style={{ color: C.text }}>
                    {q}
                </span>
                {isOpen ? (
                    <Minus
                        className="h-5 w-5 shrink-0 transition-transform duration-300"
                        style={{ color: C.accent }}
                    />
                ) : (
                    <Plus
                        className="h-5 w-5 shrink-0 transition-transform duration-300"
                        style={{ color: C.textSoft }}
                    />
                )}
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out px-6",
                    isOpen ? "max-h-40 opacity-100 pb-6" : "max-h-0 opacity-0"
                )}
            >
                <p
                    className="text-base leading-relaxed font-normal"
                    style={{ color: C.textSoft }}
                >
                    {a}
                </p>
            </div>
        </div>
    );
};

export function FAQ() {
    return (
        <section className="px-4 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-3xl">
                <h2
                    className="mb-12 text-center text-[clamp(2rem,4vw,2.5rem)] font-medium tracking-tight leading-tight"
                    style={{ color: C.text }}
                >
                    Common Questions
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    );
}
