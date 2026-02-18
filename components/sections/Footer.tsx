"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { C } from "@/lib/landing-data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const spring = { type: "spring" as const, stiffness: 200, damping: 25 };

interface FooterProps {
    onOpenAuth: (tab: "login" | "register") => void;
}

export function Footer({ onOpenAuth }: FooterProps) {
    return (
        <>
            {/* ── CTA Section ─────────────────────────────── */}
            <section className="py-20 md:py-28" style={{ backgroundColor: C.bg }}>
                {/* Top accent line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: EASE_OUT }}
                    className="h-px w-full mb-16 origin-left"
                    style={{ backgroundColor: C.border }}
                />

                <div className="max-w-lg">
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
                            Get Started
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                        className="font-serif font-medium tracking-[-0.02em]"
                        style={{
                            color: C.text,
                            fontSize: "clamp(24px, 4vw, 36px)",
                        }}
                    >
                        Ready to grow on autopilot?
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT }}
                        className="mt-3 text-sm sm:text-base leading-relaxed"
                        style={{ color: C.textSoft }}
                    >
                        Start free — no credit card needed.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.16, ease: EASE_OUT }}
                    >
                        <motion.button
                            onClick={() => onOpenAuth("register")}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            transition={spring}
                            className="group mt-8 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-6 text-sm font-medium"
                            aria-label="Start for free — sign up"
                            style={{
                                background: C.accent,
                                color: "hsl(var(--primary-foreground))",
                            }}
                        >
                            Start for free
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* ── Divider ────────────────────────────────── */}
            <div style={{ backgroundColor: C.bg }}>
                <div className="h-px w-full" style={{ backgroundColor: C.border }} />
            </div>

            {/* ── Footer ─────────────────────────────────── */}
            <footer className="py-8" style={{ backgroundColor: C.bg }}>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
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
                                className="text-sm transition-colors duration-200"
                                style={{ color: C.textMuted }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = C.textSoft; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
                            >
                                {label}
                            </Link>
                        ))}
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm transition-colors duration-200"
                            style={{ color: C.textMuted }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = C.textSoft; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
                        >
                            Twitter/X
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}
