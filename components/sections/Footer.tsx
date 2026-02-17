"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { C } from "@/lib/landing-data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24, filter: "blur(6px)" },
    whileInView: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, delay, ease: EASE },
    },
    viewport: { once: true, amount: 0.4 as const },
});

interface FooterProps {
    onOpenAuth: (tab: "login" | "register") => void;
}

export function Footer({ onOpenAuth }: FooterProps) {
    return (
        <>
            {/* ── Final CTA Band ─────────────────────────── */}
            <section
                className="relative overflow-hidden py-24 md:py-32"
                style={{ backgroundColor: C.bg }}
            >
                {/* Subtle glow */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(circle at 50% 60%, rgba(0,170,69,0.03) 0%, transparent 70%)",
                    }}
                />

                <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
                    <motion.h2
                        {...fadeUp()}
                        className="text-3xl md:text-4xl font-semibold tracking-[-0.02em]"
                        style={{ color: C.text }}
                    >
                        Ready to grow on autopilot?
                    </motion.h2>

                    <motion.p
                        {...fadeUp(0.1)}
                        className="mt-4 text-base sm:text-lg"
                        style={{ color: C.textSoft }}
                    >
                        Start free — no credit card needed.
                    </motion.p>

                    <motion.button
                        {...fadeUp(0.2)}
                        onClick={() => onOpenAuth("register")}
                        className="group mt-8 inline-flex h-12 cursor-pointer items-center gap-2 rounded-full px-8 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.96] sm:text-base"
                        style={{
                            background: `linear-gradient(135deg, ${C.accent}, ${C.accentHover})`,
                        }}
                    >
                        Start for free
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </motion.button>
                </div>
            </section>

            {/* ── Divider ────────────────────────────────── */}
            <div style={{ backgroundColor: C.bg }}>
                <div className="mx-auto h-px w-full" style={{ backgroundColor: C.border }} />
            </div>

            {/* ── Footer ─────────────────────────────────── */}
            <footer
                className="py-8"
                style={{ backgroundColor: C.bg }}
            >
                <div className="mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm" style={{ color: C.textMuted }}>
                        &copy; 2026 Flapr
                    </p>

                    <div className="flex gap-6">
                        {[
                            { label: "Privacy", href: "/privacy" },
                            { label: "Terms", href: "/terms" },
                        ].map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className="relative text-sm transition-colors hover:text-black after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all hover:after:w-full"
                                style={{ color: C.textMuted }}
                            >
                                {label}
                            </Link>
                        ))}
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noreferrer"
                            className="relative text-sm transition-colors hover:text-black after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all hover:after:w-full"
                            style={{ color: C.textMuted }}
                        >
                            Twitter/X
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}
