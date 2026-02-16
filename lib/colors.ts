/**
 * Parses any CSS color string into an {r, g, b} object.
 * Supports Hex (#RGB, #RRGGBB) and RGB/RGBA (rgb(), rgba()).
 * Defaults to { r: 99, g: 102, b: 241 } if parsing fails.
 */
export function parseColor(color: string) {
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

/**
 * Calculates the relative luminance of a color.
 * Formula from WCAG 2.0
 */
export function getLuminance({ r, g, b }: { r: number; g: number; b: number }) {
    const toLinear = (c: number) => {
        c /= 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Returns a high-contrast text color (black or white) for a given background luminance.
 */
export function getContrastColor(luminance: number) {
    return luminance > 0.35 ? "#1a1a1a" : "#ffffff";
}
