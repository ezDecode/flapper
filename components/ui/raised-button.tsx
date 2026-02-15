"use client";

import React, { useState, useRef, useCallback } from "react";

// ── Utility: parse any CSS color → {r,g,b} ──────────────────────────────────
function parseColor(color: string) {
    if (typeof document === "undefined") return { r: 99, g: 102, b: 241 }; // Default fallback for SSR
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { r: 0, g: 0, b: 0 };
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b };
}

function getLuminance({ r, g, b }: { r: number; g: number; b: number }) {
    const toLinear = (c: number) => {
        c /= 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastColor(luminance: number) {
    return luminance > 0.35 ? "#1a1a1a" : "#ffffff";
}

// ── Core RaisedButton ────────────────────────────────────────────────────────
interface RaisedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    color?: string;
    size?: "sm" | "default" | "lg" | "xl" | "icon";
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

export function RaisedButton({
    children,
    color,
    size = "default",
    disabled = false,
    onClick,
    fullWidth = false,
    icon,
    className = "",
    style,
    ...props
}: RaisedButtonProps) {
    const [pressed, setPressed] = useState(false);
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const btnRef = useRef<HTMLButtonElement>(null);

    const rgb = color ? parseColor(color) : null;
    const luminance = rgb ? getLuminance(rgb) : 0.5;
    const textColor = rgb ? getContrastColor(luminance) : "#ffffff";
    const isDark = luminance < 0.35;


    const bottomShadow = rgb
        ? `rgba(${Math.max(0, rgb.r - 60)},${Math.max(0, rgb.g - 60)},${Math.max(0, rgb.b - 60)},1)`
        : `rgba(0,0,0,0.7)`;
    const shadowColor = rgb
        ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.27)`
        : `rgba(0,0,0,0.24)`;
    const borderTop = isDark ? `rgba(255,255,255,0.55)` : `rgba(255,255,255,0.88)`;
    const borderBottom = rgb
        ? `rgba(${Math.max(0, rgb.r - 80)},${Math.max(0, rgb.g - 80)},${Math.max(0, rgb.b - 80)},0.8)`
        : `rgba(0,0,0,0.5)`;

    const sizeStyles = {
        sm: { padding: "7px 14px", fontSize: "12px", borderRadius: "10px", gap: "5px" },
        default: { padding: "10px 20px", fontSize: "14px", borderRadius: "13px", gap: "7px" },
        lg: { padding: "13px 28px", fontSize: "16px", borderRadius: "15px", gap: "8px" },
        icon: { padding: "10px", fontSize: "14px", borderRadius: "12px", gap: 0 },
        xl: { padding: "16px 36px", fontSize: "18px", borderRadius: "17px", gap: "9px" },
    }[size] || {};

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
        if (disabled) return;
        setPressed(true);
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const id = Date.now();
            setRipples((prev) => [...prev, { id, x, y }]);
            setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
        }
    }, [disabled]);

    const handlePointerUp = useCallback(() => setPressed(false), []);

    const baseStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizeStyles.gap,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        borderRadius: sizeStyles.borderRadius,
        border: "none",
        outline: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        width: fullWidth ? "100%" : "auto",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
        color: textColor,
        backgroundColor: color || "#6366f1",
        // Layered box-shadow for the 3D raised effect
        boxShadow: pressed
            ? `0 0px 0px 0px ${shadowColor},
         inset 0 1px 2px rgba(0,0,0,0.2),
         inset 0 0px 0px 0px ${borderTop},
         0 0 0 1px ${borderBottom}`
            : `0 2px 0px 0px ${bottomShadow},
         0 4px 10px 0px ${shadowColor},
         inset 0 1.5px 0px 0px ${borderTop},
         0 0 0 1px ${borderBottom}`,
        transform: pressed ? "translateY(2px)" : "translateY(0px)",
        transition: "box-shadow 0.1s ease, transform 0.1s ease, filter 0.15s ease",
        filter: pressed ? "brightness(0.92)" : "brightness(1)",
        ...style,
    };



    return (
        <button
            ref={btnRef}
            style={baseStyle}
            disabled={disabled}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onClick={onClick}
            className={className}
            {...props}
        >


            {/* Ripples */}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    aria-hidden
                    style={{
                        position: "absolute",
                        borderRadius: "50%",
                        width: 8,
                        height: 8,
                        left: ripple.x - 4,
                        top: ripple.y - 4,
                        background: "rgba(255,255,255,0.4)",
                        transform: "scale(0)",
                        animation: "ripple-expand 0.55s ease-out forwards",
                        zIndex: 2,
                        pointerEvents: "none",
                    }}
                />
            ))}

            {/* Content */}
            <span style={{ position: "relative", zIndex: 3, display: "flex", alignItems: "center", gap: sizeStyles.gap }}>
                {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
                {children}
            </span>
            <style jsx>{`
        @keyframes ripple-expand {
          to { transform: scale(28); opacity: 0; }
        }
      `}</style>
        </button>
    );
}
