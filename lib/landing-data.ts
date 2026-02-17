import {
    Clock,
    Zap,
    BarChart3,
    MessageSquare,
    Shield,
} from "lucide-react";

/* ── Palette ──────────────────────────────────────────── */

export const C = {
    bg: "#09090B",
    bgAlt: "#0F0F12",
    surface: "#18181B",
    surfaceHover: "#1F1F23",
    border: "#27272A",
    borderSubtle: "#1E1E21",
    text: "#FAFAFA",
    textSoft: "#A1A1AA",
    textMuted: "#52525B",
    accent: "#10B981",
    accentSoft: "rgba(16, 185, 129, 0.10)",
    accentHover: "#059669",
    warm: "#F59E0B",
    warmSoft: "rgba(245, 158, 11, 0.10)",
};

/* ── Data ─────────────────────────────────────────────── */

export const features = [
    {
        icon: Clock,
        title: "Smart Scheduling",
        desc: "Queue posts for optimal reach. Pick your time or let Flapr find the highest-engagement window.",
        className: "md:col-span-2",
    },
    {
        icon: Zap,
        title: "Auto-Plug Engine",
        desc: "Set a like threshold. When your post hits it, Flapr auto-replies with your CTA — zero delay.",
        className: "md:col-span-1",
    },
    {
        icon: BarChart3,
        title: "Performance Analytics",
        desc: "Track impressions, engagement rate, and conversions. Know exactly which posts drive results.",
        className: "md:col-span-1",
    },
    {
        icon: MessageSquare,
        title: "CTA Templates",
        desc: "Pre-write your plugs once. Reuse across posts. A/B test different CTAs to optimize click-through.",
        className: "md:col-span-2",
    },
    {
        icon: Shield,
        title: "Built for 𝕏",
        desc: "Deep Twitter/X integration — tweets, threads, and real-time engagement metrics. More platforms soon.",
        className: "md:col-span-3",
    },
];

export const steps = [
    {
        num: "01",
        title: "Draft & Schedule",
        description: "Compose your tweet, pick the optimal time slot, and queue it.",
    },
    {
        num: "02",
        title: "Set the Trigger",
        description: "Define the engagement threshold that signals traction.",
    },
    {
        num: "03",
        title: "Auto-Plug Fires",
        description:
            "Flapr replies instantly with your CTA — while attention peaks.",
    },
];

export const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        desc: "Perfect to try Flapr risk-free.",
        features: [
            "10 scheduled posts / month",
            "5 auto-plugs",
            "Basic analytics dashboard",
            "1 Twitter/X account",
        ],
        cta: "Get started free",
        highlighted: false,
    },
    {
        name: "Pro",
        price: "$19",
        period: "/ month",
        desc: "For creators serious about growth.",
        features: [
            "Unlimited scheduled posts",
            "50 auto-plugs / month",
            "Advanced analytics & exports",
            "CTA A/B testing",
            "Priority email support",
        ],
        cta: "Start 14-day trial",
        highlighted: true,
    },
];

export const faqs = [
    {
        q: "Is there a free plan?",
        a: "Yes — start free, no credit card required. Upgrade only when Flapr proves its value.",
    },
    {
        q: "Can I cancel anytime?",
        a: "Absolutely. Upgrade, downgrade, or cancel with one click — no lock-in.",
    },
    {
        q: "How does the auto-plug work?",
        a: "Set an engagement threshold (e.g. 50 likes). When reached, Flapr auto-replies with your pre-written CTA.",
    },
    {
        q: "Which platforms are supported?",
        a: "Twitter/X with deep integration. More platforms shipping soon.",
    },
];
