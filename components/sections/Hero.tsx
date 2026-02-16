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

const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 18.338C0 8.216 8.474 0 18.92 0h218.16C247.53 0 256 8.216 256 18.338v219.327C256 247.79 247.53 256 237.08 256H18.92C8.475 256 0 247.791 0 237.668V18.335z" fill="#069" />
        <path d="M77.796 214.238V98.986H39.488v115.252H77.8zM58.65 83.253c13.356 0 21.671-8.85 21.671-19.91-.25-11.312-8.315-19.915-21.417-19.915-13.111 0-21.674 8.603-21.674 19.914 0 11.06 8.312 19.91 21.169 19.91h.248zM99 214.238h38.305v-64.355c0-3.44.25-6.889 1.262-9.346 2.768-6.885 9.071-14.012 19.656-14.012 13.858 0 19.405 10.568 19.405 26.063v61.65h38.304v-66.082c0-35.399-18.896-51.872-44.099-51.872-20.663 0-29.738 11.549-34.78 19.415h.255V98.99H99.002c.5 10.812-.003 115.252-.003 115.252z" fill="#fff" />
    </svg>
);

const BlueskyIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 -3.268 64 68.414" xmlns="http://www.w3.org/2000/svg">
        <path fill="#0085ff" d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805zm36.254 0C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745z" />
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
    {
        name: "LinkedIn",
        shortName: "LinkedIn",
        Icon: LinkedInIcon,
        color: "#0a66c2",
        bg: "rgba(10,102,194,0.10)",
        border: "rgba(10,102,194,0.28)",
        iconBg: "transparent",
        iconColor: "#0a66c2",
    },
    {
        name: "Bluesky",
        shortName: "Bluesky",
        Icon: BlueskyIcon,
        color: "#0085ff",
        bg: "rgba(0,133,255,0.10)",
        border: "rgba(0,133,255,0.28)",
        iconBg: "transparent",
        iconColor: "#0085ff",
    },
];

const CYCLE_DURATION = 2600;
const BLUR_DURATION = 380;

type Phase = "visible" | "blurring-out" | "blurring-in";

export function PlatformCycler() {
    const [index, setIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>("visible");
    const [nextIndex, setNextIndex] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            const next = (index + 1) % PLATFORMS.length;
            setNextIndex(next);
            setPhase("blurring-out");

            const midTimer = setTimeout(() => {
                setIndex(next);
                setPhase("blurring-in");

                const inTimer = setTimeout(() => {
                    setPhase("visible");
                }, BLUR_DURATION);

                return () => clearTimeout(inTimer);
            }, BLUR_DURATION);

            return () => clearTimeout(midTimer);
        }, CYCLE_DURATION);

        return () => clearInterval(interval);
    }, [index]);

    const platform = PLATFORMS[index];

    const blurStyle: React.CSSProperties =
        phase === "blurring-out"
            ? {
                opacity: 0,
                filter: "blur(12px)",
                transform: "translateY(-6px) scale(0.96)",
                transition: `all ${BLUR_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
            }
            : phase === "blurring-in"
                ? {
                    opacity: 0,
                    filter: "blur(12px)",
                    transform: "translateY(6px) scale(0.96)",
                    transition: "none",
                }
                : {
                    opacity: 1,
                    filter: "blur(0px)",
                    transform: "translateY(0px) scale(1)",
                    transition: `all ${BLUR_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
                };

    return (
        <span
            className="inline-flex items-center justify-center align-middle"
            style={{
                ...blurStyle,
                width: "1.1em",
                height: "1.1em",
                verticalAlign: "middle",
                position: "relative",
                top: "-0.06em",
                willChange: "opacity, filter, transform",
                color: platform.color,
            }}
        >
            <platform.Icon className="w-full h-full" />
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
        <section className="relative flex flex-col items-center justify-center px-4 pt-40 pb-10 text-center md:px-8 md:pt-52 md:pb-16">
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

            {/* Description */}
            <motion.p
                {...fadeUp(SEQUENCE.description)}
                className="mt-8 max-w-xl text-lg leading-relaxed text-balance font-normal"
                style={{ color: C.textSoft }}
            >
                Schedule detailed threads. Set engagement triggers. Flapr replies with
                your CTA exactly when your post takes off — capturing every opportunity
                while you sleep.
            </motion.p>

            {/* CTA */}
            <motion.div
                {...fadeUp(SEQUENCE.cta)}
                className="mt-10 flex flex-row items-center justify-center gap-3 sm:gap-4"
            >
                <button
                    onClick={() => onOpenAuth("register")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl h-10 px-5 text-sm font-medium sm:h-12 sm:px-8 sm:text-base transition-colors cursor-pointer active:scale-[0.96] hover:opacity-90"
                    style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
                >
                    Start for free
                    <ArrowRight className="h-4 w-4" />
                </button>

                <a
                    href="#how-it-works"
                    className="group inline-flex h-10 items-center gap-2 rounded-xl border px-5 text-sm font-medium transition-colors hover:bg-white/5 sm:h-12 sm:rounded-[15px] sm:px-8 sm:text-base"
                    style={{ borderColor: C.border, color: C.textSoft }}
                >
                    See how it works
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
            </motion.div>
        </section>
    );
}
