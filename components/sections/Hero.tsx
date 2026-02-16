"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { StaggeredText } from "@/components/ui/staggered-text";
import { C } from "@/lib/landing-data";
import { useEffect, useState } from "react";

// Inline SVGs to avoid extra icon component dependencies
const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 1200 1226.37" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M714.163 519.284L1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284zM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854z" />
    </svg>
);



const PLATFORMS = [
    {
        name: "X (Twitter)",
        shortName: "X",
        Icon: XIcon,
        color: "#e7e7e7",
        bg: "rgba(231,231,231,0.10)",
        border: "rgba(231,231,231,0.18)",
        iconBg: "#000",
        iconColor: "#fff",
    },

];

// Simplified static badge
export function PlatformCycler() {
    return (
        <span
            className="inline-flex items-center justify-center align-middle"
            style={{
                width: "1.1em",
                height: "1.1em",
                verticalAlign: "middle",
                position: "relative",
                top: "-0.06em",
                color: "#e7e7e7",
            }}
        >
            <XIcon className="w-full h-full" />
        </span>
    );
}

// ─── Sequence timing (ms from page load) ──────────────────────────────────────
const SEQUENCE = {
    badge: 200,
    headingLine1: 500,
    headingLine2: 900,
    description: 1400,
    cta: 1800,
    features: 2200,
} as const;

// ─── Fade-up motion variant ───────────────────────────────────────────────────
const EASE = [0.19, 1, 0.22, 1] as const;

const fadeUp = (delayMs: number) => ({
    initial: { opacity: 0, y: 20, filter: "blur(6px)" },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            delay: delayMs / 1000,
            ease: EASE as unknown as [number, number, number, number],
        },
    },
});

interface HeroProps {
    onOpenAuth: (tab: "login" | "register") => void;
}

export function Hero({ onOpenAuth }: HeroProps) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), SEQUENCE.badge),
            setTimeout(() => setStep(2), SEQUENCE.headingLine1),
            setTimeout(() => setStep(3), SEQUENCE.headingLine2),
            setTimeout(() => setStep(4), SEQUENCE.description),
            setTimeout(() => setStep(5), SEQUENCE.cta),
            setTimeout(() => setStep(6), SEQUENCE.features),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="relative flex flex-col items-end justify-center px-4 pt-40 pb-10 text-right md:px-8 md:pt-52 md:pb-16">
            {/* Badge */}
            <motion.div
                {...fadeUp(SEQUENCE.badge)}
                className="mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-medium"
                style={{
                    borderColor: C.border,
                    color: C.textSoft,
                    background: C.surface,
                }}
            >
                <PlatformCycler />
                Now in public beta
            </motion.div>

            {/* Heading */}
            <h1 className="max-w-4xl text-[clamp(2.5rem,8vw,5rem)] font-medium tracking-tighter leading-[1.15] md:leading-[1.1]">
                <StaggeredText
                    text="Engage smarter."
                    as="span"
                    segmentBy="chars"
                    delay={25}
                    duration={0.5}
                    direction="top"
                    blur
                    easing="anticipate"
                    startAnimation={step >= 2}
                    className="!w-auto"
                />
                <br />
                <span style={{ color: C.textMuted }}>
                    <StaggeredText
                        text="Convert on autopilot."
                        as="span"
                        segmentBy="chars"
                        delay={25}
                        duration={0.5}
                        direction="top"
                        blur
                        easing="anticipate"
                        startAnimation={step >= 3}
                        className="!w-auto"
                    />
                </span>
            </h1>



            {/* CTA */}
            <motion.div
                {...fadeUp(SEQUENCE.cta)}
                className="mt-10 flex flex-row items-center justify-end gap-3 sm:gap-4"
            >
                <button
                    onClick={() => onOpenAuth("register")}
                    className="inline-flex items-center justify-center gap-2 rounded-full h-10 px-5 text-sm font-medium sm:h-12 sm:px-8 sm:text-base transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90"
                    style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
                >
                    Start for free
                    <ArrowRight className="h-4 w-4" />
                </button>

                <a
                    href="#how-it-works"
                    className="group inline-flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors hover:bg-white/5 sm:h-12 sm:px-8 sm:text-base"
                    style={{ borderColor: C.border, color: C.textSoft }}
                >
                    See how it works
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
            </motion.div>
        </section>
    );
}
