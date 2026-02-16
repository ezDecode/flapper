"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Zap, BarChart3 } from "lucide-react";
import { C } from "@/lib/landing-data";

/* ── Config ─── */
const DURATION = 5000;
const SIZE = 56;
const PADDING = 3;
const RADIUS = 12;

/* ── useMeasure — inner content drives outer width animation ─── */
function useMeasure() {
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    const [bounds, setBounds] = useState({ width: 0, height: 0 });
    const ref = useCallback((node: HTMLDivElement | null) => setElement(node), []);

    useEffect(() => {
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => {
            setBounds({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            });
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [element]);

    return [ref, bounds] as const;
}

/* ── Feature Items ─── */
const items = [
    {
        id: "scheduling",
        label: "Smart Scheduling",
        description: "Queue posts for X — pick your time or let Flapr find the best slot.",
        color: "#3b82f6",
        icon: Clock,
    },
    {
        id: "autoplug",
        label: "Auto-Plug Engine",
        description: "Set a like threshold. When your post hits it, Flapr auto-replies with your CTA — zero delay.",
        color: "#8B5CF6",
        icon: Zap,
    },
    {
        id: "analytics",
        label: "Performance Analytics",
        description: "Track impressions, engagement & conversions. Know exactly which posts drive results.",
        color: "#10b981",
        icon: BarChart3,
    },
];

/* ── Rounded Rect Progress ─── */
function RoundedRectProgress({
    progress,
    size,
    padding,
    radius,
}: {
    progress: number;
    size: number;
    padding: number;
    radius: number;
}) {
    const inner = size - padding * 2;
    const straight = inner - 2 * radius;
    const perimeter = 2 * straight + 2 * straight + 2 * Math.PI * radius;
    const offset = perimeter * (1 - progress);

    return (
        <svg
            width={size}
            height={size}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
            <rect
                x={padding}
                y={padding}
                width={inner}
                height={inner}
                rx={radius}
                ry={radius}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={3}
            />
            <rect
                x={padding}
                y={padding}
                width={inner}
                height={inner}
                rx={radius}
                ry={radius}
                fill="none"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={perimeter}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 50ms linear" }}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
        </svg>
    );
}

/* ── Animation Variants ─── */
const ENTER_EASE: [number, number, number, number] = [0.0, 0.0, 0.2, 1.0];
const EXIT_EASE: [number, number, number, number] = [0.4, 0.0, 1.0, 1.0];

const titleVariants = {
    initial: { opacity: 0, y: 8, filter: "blur(6px)" },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            y: { type: "spring" as const, stiffness: 260, damping: 26, mass: 0.8 },
            opacity: { duration: 0.35, ease: ENTER_EASE },
            filter: { duration: 0.4, ease: ENTER_EASE },
        },
    },
    exit: {
        opacity: 0,
        y: -6,
        filter: "blur(6px)",
        transition: {
            y: { duration: 0.25, ease: EXIT_EASE },
            opacity: { duration: 0.22, ease: EXIT_EASE },
            filter: { duration: 0.25, ease: EXIT_EASE },
        },
    },
};

const descVariants = {
    initial: { opacity: 0, y: 10, filter: "blur(6px)" },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            y: { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.9, delay: 0.08 },
            opacity: { duration: 0.4, ease: ENTER_EASE, delay: 0.08 },
            filter: { duration: 0.42, ease: ENTER_EASE, delay: 0.08 },
        },
    },
    exit: {
        opacity: 0,
        y: -5,
        filter: "blur(6px)",
        transition: {
            y: { duration: 0.2, ease: EXIT_EASE },
            opacity: { duration: 0.18, ease: EXIT_EASE },
            filter: { duration: 0.2, ease: EXIT_EASE },
        },
    },
};

/* ── Main Component ─── */
export function Features() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const startRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);
    const [innerRef, bounds] = useMeasure();

    useEffect(() => {
        startRef.current = performance.now();
        const tick = (now: number) => {
            const p = Math.min((now - (startRef.current ?? now)) / DURATION, 1);
            setProgress(p);
            if (p < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                setActiveIndex((prev) => (prev + 1) % items.length);
                setProgress(0);
                startRef.current = performance.now();
                rafRef.current = requestAnimationFrame(tick);
            }
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const active = items[activeIndex];
    const IconComponent = active.icon;

    return (
        <section id="features" className="flex justify-center px-4 pb-20 md:px-8 md:pb-24">
            <div
                className="flex flex-row items-center gap-3 rounded-2xl border px-4 py-4 max-w-full sm:gap-4 sm:px-6"
                style={{
                    background: C.surface,
                    borderColor: C.border,
                    boxShadow: "0 2px 24px rgba(0,0,0,0.25)",
                }}
            >
                {/* ─── Feature Icons: single rotating icon on mobile, all 3 on sm+ ─── */}
                {/* Mobile: single active icon */}
                <div className="shrink-0 sm:hidden">
                    <AnimatePresence mode="wait">
                        {(() => {
                            const item = items[activeIndex];
                            const ItemIcon = item.icon;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                                    className="relative flex items-center justify-center shrink-0"
                                    style={{
                                        width: SIZE,
                                        height: SIZE,
                                        borderRadius: RADIUS + PADDING,
                                        background: item.color,
                                    }}
                                >
                                    <ItemIcon
                                        className="h-6 w-6"
                                        style={{ color: "white" }}
                                    />
                                    <RoundedRectProgress
                                        progress={progress}
                                        size={SIZE}
                                        padding={PADDING}
                                        radius={RADIUS}
                                    />
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>
                </div>

                {/* Desktop: all icons */}
                <div className="hidden sm:flex gap-2 shrink-0">
                    {items.map((item, i) => {
                        const isActive = i === activeIndex;
                        const ItemIcon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveIndex(i);
                                    setProgress(0);
                                    startRef.current = performance.now();
                                }}
                                className="relative flex items-center justify-center shrink-0 transition-all duration-500 ease-out"
                                style={{
                                    width: SIZE,
                                    height: SIZE,
                                    borderRadius: RADIUS + PADDING,
                                    background: isActive ? item.color : "rgba(255,255,255,0.06)",
                                }}
                            >
                                <ItemIcon
                                    className="h-6 w-6 transition-opacity duration-500 ease-out"
                                    style={{
                                        color: "white",
                                        opacity: isActive ? 1 : 0.35,
                                    }}
                                />
                                {isActive && (
                                    <RoundedRectProgress
                                        progress={progress}
                                        size={SIZE}
                                        padding={PADDING}
                                        radius={RADIUS}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ─── Animated Text ─── */}
                <motion.div
                    animate={{
                        width: bounds.width > 0 ? bounds.width : "auto",
                        height: bounds.height > 0 ? bounds.height : "auto",
                    }}
                    transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
                    className="overflow-hidden min-w-0"
                >
                    <div
                        ref={innerRef}
                        className="sm:w-max"
                        style={{ maxWidth: 360 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div key={active.id}>
                                <motion.p
                                    variants={titleVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="mb-1 text-sm font-medium whitespace-nowrap sm:text-base"
                                    style={{
                                        color: C.text,
                                        letterSpacing: "-0.01em",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {active.label}
                                </motion.p>

                                <motion.p
                                    variants={descVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="text-xs leading-relaxed sm:text-sm"
                                    style={{
                                        color: C.textSoft,
                                        maxWidth: 336,
                                        whiteSpace: "normal",
                                    }}
                                >
                                    {active.description}
                                </motion.p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
