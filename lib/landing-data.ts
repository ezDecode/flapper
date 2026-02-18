import {
    Clock,
    Zap,
    BarChart3,
    MessageSquare,
    Shield,
} from "lucide-react";

/* ── Palette ──────────────────────────────────────────── */

export const C = {
    bg: "hsl(var(--background))",
    bgAlt: "hsl(var(--surface-alt))",
    surface: "hsl(var(--surface))",
    surfaceHover: "hsl(var(--surface-hover))",
    border: "hsl(var(--border))",
    borderSubtle: "hsl(var(--border))",
    text: "hsl(var(--text))",
    textSoft: "hsl(var(--text-soft))",
    textMuted: "hsl(var(--text-muted))",
    accent: "hsl(var(--primary))",
    accentSoft: "hsl(var(--accent-soft))",
    accentHover: "hsl(var(--accent-hover))",
    warm: "hsl(var(--warm))",
    warmSoft: "hsl(var(--warm-soft))",
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
        title: "Built for Twitter",
        desc: "Deep Twitter/X integration — tweets, threads, and real-time engagement metrics. More platforms soon.",
        className: "md:col-span-3",
    },
];

export const steps = [
    {
        num: "01",
        title: "Draft & Schedule",
        description: "Draft your tweet, set the time, and queue.",
    },
    {
        num: "02",
        title: "Set the Trigger",
        description: "Set the engagement threshold to watch.",
    },
    {
        num: "03",
        title: "Auto-Plug Fires",
        description: "Flapr replies with your CTA instantly.",
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
