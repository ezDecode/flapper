"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const OFFSET: Record<string, Record<string, string | number>> = {
    top: { y: "40%", opacity: 0 },
    bottom: { y: "-40%", opacity: 0 },
    left: { x: "40%", opacity: 0 },
    right: { x: "-40%", opacity: 0 },
};

type StaggerDirection = "forward" | "reverse" | "center";

function buildStaggerOrder(count: number, staggerDirection: StaggerDirection) {
    const indices = Array.from({ length: count }, (_, i) => i);
    if (staggerDirection === "reverse") return [...indices].reverse();
    if (staggerDirection === "center") {
        const mid = Math.floor(count / 2);
        const sorted: number[] = [];
        let left = mid,
            right = mid + 1;
        while (left >= 0 || right < count) {
            if (left >= 0) sorted.push(left--);
            if (right < count) sorted.push(right++);
        }
        return sorted;
    }
    return indices;
}

function splitText(text: string, segmentBy: "chars" | "words" | "lines", separator?: string) {
    const rows = separator ? text.split(separator) : [text];
    return rows.map((row) => {
        if (segmentBy === "chars") return row.split("");
        if (segmentBy === "words") return row.split(/(\s+)/);
        return [row];
    });
}

function getSegmentDelay(globalIndex: number, staggerOrder: number[], delayMs: number) {
    const position = staggerOrder.indexOf(globalIndex);
    return (position * delayMs) / 1000;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type MotionTagName = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";

interface StaggeredTextProps {
    text?: string;
    className?: string;
    as?: MotionTagName;
    segmentBy?: "chars" | "words" | "lines";
    separator?: string;
    delay?: number;
    duration?: number;
    easing?: "anticipate" | "easeOut" | "easeInOut" | "linear" | "backOut" | "easeIn" | "backIn" | "backInOut" | "circIn" | "circOut" | "circInOut";
    threshold?: number;
    rootMargin?: string;
    direction?: "top" | "bottom" | "left" | "right";
    blur?: boolean;
    staggerDirection?: StaggerDirection;
    respectReducedMotion?: boolean;
    exitOnScrollOut?: boolean;
    from?: Record<string, string | number>;
    to?: Record<string, string | number>;
    onAnimationComplete?: () => void;
    onExitComplete?: () => void;
    animKey?: number;
    startAnimation?: boolean;
}

// ─── Core Component ───────────────────────────────────────────────────────────

export function StaggeredText({
    text = "",
    className = "",
    as: Tag = "p",
    segmentBy = "words",
    separator,
    delay = 80,
    duration = 0.6,
    easing = "anticipate",
    threshold = 0.1,
    rootMargin = "0px",
    direction = "top",
    blur = true,
    staggerDirection = "forward",
    respectReducedMotion = true,
    exitOnScrollOut = false,
    from,
    to,
    onAnimationComplete,
    onExitComplete,
    animKey,
    startAnimation,
}: StaggeredTextProps) {
    const containerRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = !(respectReducedMotion && prefersReducedMotion);

    // If startAnimation is controlled externally, use it; otherwise use IntersectionObserver
    const controlled = typeof startAnimation === "boolean";

    useEffect(() => {
        if (controlled) {
            setIsVisible(startAnimation!);
            return;
        }

        setIsVisible(false);
        const timeout = setTimeout(() => {
            const node = containerRef.current;
            if (!node) return;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        if (!exitOnScrollOut) observer.disconnect();
                    } else if (exitOnScrollOut) {
                        setIsVisible(false);
                    }
                },
                { threshold, rootMargin },
            );
            observer.observe(node);
            return () => observer.disconnect();
        }, 50);
        return () => clearTimeout(timeout);
    }, [animKey, threshold, rootMargin, exitOnScrollOut, controlled, startAnimation]);

    const defaultFrom = from ?? {
        ...OFFSET[direction],
        ...(blur ? { filter: "blur(8px)" } : {}),
    };

    const defaultTo = to ?? { y: 0, x: 0, opacity: 1, filter: "blur(0px)" };

    const rows = splitText(text, segmentBy, separator);
    const totalSegments = rows.reduce((acc, row) => acc + row.length, 0);
    const staggerOrder = buildStaggerOrder(totalSegments, staggerDirection);

    let globalIndex = 0;

    // motion[Tag] for dynamic tag
    const MotionTag = motion[Tag] as typeof motion.p;

    return (
        <MotionTag
            ref={containerRef as React.Ref<HTMLParagraphElement>}
            className={`inline-block ${className}`}
            aria-label={text}
        >
            {rows.map((segments, rowIndex) => (
                <span
                    key={rowIndex}
                    style={{ display: "inline-block", width: "100%", overflow: "visible" }}
                    aria-hidden="true"
                >
                    {segments.map((segment) => {
                        const currentIndex = globalIndex++;
                        const segDelay = getSegmentDelay(currentIndex, staggerOrder, delay);
                        const isWhitespace = /^\s+$/.test(segment);

                        return isWhitespace ? (
                            <span key={`ws-${currentIndex}`}>{segment}</span>
                        ) : (
                            <AnimatePresence
                                key={`ap-${rowIndex}-${currentIndex}`}
                                onExitComplete={
                                    currentIndex === totalSegments - 1 ? onExitComplete : undefined
                                }
                            >
                                <motion.span
                                    key={`seg-${animKey}-${currentIndex}`}
                                    style={{ display: "inline-block", willChange: "transform" }}
                                    initial={shouldAnimate ? defaultFrom : false}
                                    animate={
                                        isVisible && shouldAnimate
                                            ? defaultTo
                                            : shouldAnimate
                                              ? defaultFrom
                                              : false
                                    }
                                    transition={{ duration, delay: segDelay, ease: easing }}
                                    onAnimationComplete={
                                        currentIndex === totalSegments - 1 && isVisible
                                            ? onAnimationComplete
                                            : undefined
                                    }
                                >
                                    {segment}
                                </motion.span>
                            </AnimatePresence>
                        );
                    })}
                </span>
            ))}
        </MotionTag>
    );
}
