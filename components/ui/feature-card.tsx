"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React, { useState } from "react";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    className?: string;
    style?: React.CSSProperties;
}

const C = {
    surface: "#1A1A1E",
    surfaceHover: "#222226",
    border: "#27272B",
    text: "#F1F1F3",
    textSoft: "#A1A1AA",
    accent: "#8B5CF6",
};

export function FeatureCard({
    icon: Icon,
    title,
    description,
    className,
    style,
}: FeatureCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-3xl border p-8 transition-all duration-300",
                className
            )}
            style={{
                background: C.surface,
                borderColor: isHovered ? "rgba(255,255,255,0.1)" : C.border,
                ...style,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* ─── Gradient Glow Effect ─── */}
            <div
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-[80px] transition-opacity duration-500"
                style={{ opacity: isHovered ? 0.6 : 0 }}
            />
            <div
                className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-500/10 blur-[60px] transition-opacity duration-500"
                style={{ opacity: isHovered ? 0.4 : 0 }}
            />

            {/* ─── Icon ─── */}
            <div
                className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: isHovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                    transform: isHovered ? "translateY(-2px)" : "none",
                }}
            >
                <Icon
                    className="h-6 w-6 transition-colors duration-300"
                    style={{ color: isHovered ? "#A78BFA" : C.accent }}
                />
            </div>

            {/* ─── Content ─── */}
            <div className="relative z-10">
                <h3
                    className="mb-3 text-xl font-medium transition-colors duration-300"
                    style={{ color: isHovered ? "#fff" : C.text }}
                >
                    {title}
                </h3>
                <p
                    className="text-sm leading-relaxed font-normal transition-colors duration-300"
                    style={{ color: isHovered ? "#d4d4d8" : C.textSoft }}
                >
                    {description}
                </p>
            </div>

            {/* ─── Hover Border Shine ─── */}
            <div
                className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            />
        </div>
    );
}
