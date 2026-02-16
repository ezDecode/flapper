"use client";

import React, { useState, useRef, useCallback } from "react";

// ── Utility: parse any CSS color → {r,g,b} ──────────────────────────────────
// ── Utility: parse any CSS color → {r,g,b} ──────────────────────────────────
function parseColor(color: string) {
    if (!color) return { r: 99, g: 102, b: 241 }; // Default fallback

    // Handle Hex
    if (color.startsWith("#")) {
        const hex = color.slice(1);
        if (hex.length === 3) {
            return {
                r: parseInt(hex[0] + hex[0], 16),
                g: parseInt(hex[1] + hex[1], 16),
                b: parseInt(hex[2] + hex[2], 16),
            };
        }
        if (hex.length === 6) {
            return {
                r: parseInt(hex.slice(0, 2), 16),
                g: parseInt(hex.slice(2, 4), 16),
                b: parseInt(hex.slice(4, 6), 16),
            };
        }
    }

    // Handle RGB/RGBA
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10),
        };
    }

    // Default fallback for unparseable colors
    return { r: 99, g: 102, b: 241 };
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
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "default" | "lg" | "xl" | "icon";
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

export function RaisedButton({
    children,
    variant = "primary",
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

    // ── Variant Styles ─────────────────────────────────────────────────────────
    // Primary: Purple #8B5CF6
    // Secondary: Dark Grey #27272B (surface)
    // Outline: Transparent with border
    // Ghost: Transparent no border
    // Danger: Red #EF4444

    const getVariantStyles = (variant: string) => {
        switch (variant) {
            case "secondary":
                return {
                    bg: "#27272B",
                    color: "#F1F1F3",
                    shadowColor: "rgba(0,0,0,0.24)",
                    bottomShadow: "rgba(0,0,0,0.6)",
                    borderTop: "rgba(255,255,255,0.1)",
                    borderBottom: "rgba(0,0,0,0.8)",
                };
            case "outline":
                return {
                    bg: "transparent",
                    color: "#F1F1F3",
                    shadowColor: "transparent",
                    bottomShadow: "transparent",
                    borderTop: "rgba(255,255,255,0.1)", // actually border all around
                    borderBottom: "transparent",
                };
            case "ghost":
                return {
                    bg: "transparent",
                    color: "#A1A1AA",
                    shadowColor: "transparent",
                    bottomShadow: "transparent",
                    borderTop: "transparent",
                    borderBottom: "transparent",
                };
            case "danger":
                return {
                    bg: "#EF4444",
                    color: "#ffffff",
                    shadowColor: "rgba(239, 68, 68, 0.24)",
                    bottomShadow: "rgba(185, 28, 28, 1)",
                    borderTop: "rgba(255,255,255,0.3)",
                    borderBottom: "rgba(127, 29, 29, 0.8)",
                };
            case "primary":
            default:
                return {
                    bg: "#8B5CF6",
                    color: "#ffffff",
                    shadowColor: "rgba(139, 92, 246, 0.24)",
                    bottomShadow: "rgba(91, 33, 182, 1)", // darker purple
                    borderTop: "rgba(255,255,255,0.4)",
                    borderBottom: "rgba(76, 29, 149, 0.8)",
                };
        }
    };

    const vStyles = getVariantStyles(variant);
    const isFlat = variant === "outline" || variant === "ghost";

    const customBg = style?.backgroundColor?.toString() || style?.background?.toString();
    const effectiveBg = customBg || vStyles.bg;

    // Parse effective background for dynamic shadow generation
    // Only strictly needed if customBg is present, but consistent to always have it.
    // If not custom, we can just use vStyles for exact backwards compatibility, 
    // OR use the dynamic logic for everything if we trust it.
    // To be safe and stick to the "fix" request for custom colors, let's prioritize custom overrides.

    let computedStyle = { ...vStyles };

    if (customBg) {
        const { r, g, b } = parseColor(effectiveBg);

        // Dynamic Shadow: 24% opacity of the base color
        const dynamicShadowColor = `rgba(${r}, ${g}, ${b}, 0.24)`;

        // Dynamic Bottom Shadow: Darker version of base color
        // Subtracting ~60 from each channel to create depth
        const bottomR = Math.max(0, r - 60);
        const bottomG = Math.max(0, g - 60);
        const bottomB = Math.max(0, b - 60);
        const dynamicBottomShadow = `rgba(${bottomR}, ${bottomG}, ${bottomB}, 1)`;

        // Dynamic Border Bottom: Even darker or similar
        const borderR = Math.max(0, r - 80);
        const borderG = Math.max(0, g - 80);
        const borderB = Math.max(0, b - 80);
        const dynamicBorderBottom = `rgba(${borderR}, ${borderG}, ${borderB}, 0.8)`;

        computedStyle = {
            ...vStyles,
            bg: effectiveBg,
            shadowColor: dynamicShadowColor,
            bottomShadow: dynamicBottomShadow,
            borderBottom: dynamicBorderBottom,
            // Keep borderTop from variant (usually white overlay)
        };
    }

    const sizeStyles = {
        sm: { padding: "7px 14px", fontSize: "12px", borderRadius: "10px", gap: "5px" },
        default: { padding: "10px 20px", fontSize: "14px", borderRadius: "13px", gap: "7px" },
        lg: { padding: "13px 22px", fontSize: "16px", borderRadius: "15px", gap: "8px" },
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

    // Construct box-shadow based on variant
    let boxShadow = "none";
    if (!isFlat) {
        boxShadow = pressed
            ? `0 0px 0px 0px ${computedStyle.shadowColor},
         inset 0 1px 2px rgba(0,0,0,0.2),
         inset 0 0px 0px 0px ${computedStyle.borderTop},
         0 0 0 1px ${computedStyle.borderBottom}`
            : `0 1.5px 0px 0px ${computedStyle.bottomShadow},
         0 4px 10px 0px ${computedStyle.shadowColor},
         inset 0 1.5px 0px 0px ${computedStyle.borderTop},
         0 0 0 1px ${computedStyle.borderBottom}`;
    } else if (variant === "outline") {
        boxShadow = `inset 0 0 0 1px ${computedStyle.borderTop}`; // simple border
    }

    const baseStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizeStyles.gap,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
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
        color: computedStyle.color,
        backgroundColor: computedStyle.bg,
        boxShadow: boxShadow,
        transform: !isFlat && pressed ? "translateY(1.5px)" : "translateY(0px)",
        transition: "box-shadow 0.1s ease, transform 0.1s ease, filter 0.15s ease, background-color 0.2s ease, color 0.2s ease",
        filter: pressed && !isFlat ? "brightness(0.92)" : "brightness(1)",
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
