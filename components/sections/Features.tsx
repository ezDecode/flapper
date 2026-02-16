"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Zap, BarChart3 } from "lucide-react";
import { C } from "@/lib/landing-data";

/* ── Config ─── */
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
        description: "Queue X/Twitter posts - pick a time or let Flapr optimize it.",
        color: "#3b82f6",
        icon: Clock,
    },
    {
        id: "autoplug",
        label: "Auto-Plug Engine",
        description: "Set a like threshold. Flapr auto-replies with your CTA instantly.",
        color: "#8B5CF6",
        icon: Zap,
    },
    {
        id: "analytics",
        label: "Performance Analytics",
        description: "Track impressions & conversions. See exactly what drives results.",
        color: "#10b981",
        icon: BarChart3,
    },
];

/* ── Rounded Rect Progress ─── */
function RoundedRectProgress({
    progress,
    size,
    padding,
    radius, // kept for prop compatibility but unused for circle
}: {
    progress: number;
    size: number;
    padding: number;
    radius: number;
}) {
    const center = size / 2;
    const strokeWidth = 3;
    const r = (size - padding * 2 - strokeWidth) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - progress);

    return (
        <svg
            width={size}
            height={size}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
            <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={strokeWidth}
            />
            <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="white"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 50ms linear" }}
                transform={`rotate(-90 ${center} ${center})`}
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
    const [innerRef, bounds] = useMeasure();

    // Auto-rotation removed as requested

    const active = items[activeIndex];
    const IconComponent = active.icon;

    return (
        <section id="features" className="flex justify-start px-4 pb-20 md:px-8 md:pb-24">
            <div
                className="flex flex-row items-center gap-2 rounded-full border px-3 py-2.5 sm:gap-3 sm:px-4"
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
                                        borderRadius: 9999,
                                        background: item.color,
                                    }}
                                >
                                    <ItemIcon
                                        className="h-6 w-6"
                                        style={{ color: "white" }}
                                    />
                                    <RoundedRectProgress
                                        progress={0}
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
                                }}
                                className="relative flex items-center justify-center shrink-0 transition-all duration-500 ease-out"
                                style={{
                                    width: SIZE,
                                    height: SIZE,
                                    borderRadius: 9999,
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
                                        progress={0}
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
                        style={{ maxWidth: 280 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div key={active.id}>
                                <motion.p
                                    variants={titleVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="mb-0.5 text-sm font-medium whitespace-nowrap sm:text-base"
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
                                        maxWidth: 280,
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
