import {
    Clock,
    Zap,
    BarChart3,
    MessageSquare,
    Shield,
} from "lucide-react";

/* ── Palette ──────────────────────────────────────────── */

export const C = {
    bg: "#0C0C0E",
    bgAlt: "#131316",
    surface: "#1A1A1E",
    surfaceHover: "#222226",
    border: "#27272B",
    text: "#F1F1F3",
    textSoft: "#A1A1AA",
    textMuted: "#63636E",
    accent: "#8B5CF6",
    accentSoft: "rgba(139, 92, 246, 0.12)",
};

/* ── Data ─────────────────────────────────────────────── */

export const features = [
    {
        icon: Clock,
        title: "Smart Scheduling",
        desc: "Queue posts for Twitter/X. Pick your time or let Flapr find the best slot.",
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
        desc: "Track impressions, engagement, and conversions. Know exactly which posts drive results.",
        className: "md:col-span-1",
    },
    {
        icon: MessageSquare,
        title: "CTA Templates",
        desc: "Pre-write your plugs once. Reuse across posts. A/B test different CTAs to optimize clicks.",
        className: "md:col-span-2",
    },
    {
        icon: Shield,
        title: "Twitter Focused",
        desc: "Built specifically to grow your X audience. No distractions, just tools that work.",
        className: "md:col-span-3",
    },
];

export const steps = [
    {
        num: "01",
        title: "Draft & Schedule",
        description: "Write once and publish across platforms at the right time.",
    },
    {
        num: "02",
        title: "Set the trigger",
        description: "Choose the signal that means your post is gaining traction.",
    },
    {
        num: "03",
        title: "Auto-plug fires",
        description:
            "Flapr replies instantly with your CTA — while attention is highest.",
    },
];

export const testimonials = [
    {
        quote:
            "Scheduled a post and stepped away for the weekend. Came back to new customers from the auto-plug.",
        name: "Sarah Chen",
        role: "Indie maker · 12K followers",
    },
    {
        quote:
            "I used to manually reply to my own viral tweets. Now Flapr does it in milliseconds. Game changer.",
        name: "Marcus Rivera",
        role: "SaaS founder · 8K followers",
    },
    {
        quote:
            "The ROI is insane. $19/mo and it's already paid for itself ten times over from auto-plug conversions.",
        name: "Priya Sharma",
        role: "Content creator · 22K followers",
    },
];

export const plans = [
    {
        name: "Free",
        price: "$0",
        period: "",
        features: [
            "10 posts / month",
            "5 auto-plugs",
            "Basic analytics",
        ],
        cta: "Get started",
        highlighted: false,
    },
    {
        name: "Pro",
        price: "$19",
        period: "/ month",
        features: [
            "100 posts",
            "50 auto-plugs",
            "Advanced analytics",
            "Priority support",
        ],
        cta: "Choose Pro",
        highlighted: true,
    },

];

export const faqs = [
    {
        q: "Is there a free plan?",
        a: "Yes. Start free — no credit card required.",
    },
    {
        q: "Can I cancel anytime?",
        a: "Yes. Upgrade, downgrade, or cancel anytime.",
    },
    {
        q: "How does the auto-plug work?",
        a: "Set a threshold (like 50 likes). When it’s reached, Flapr replies with your CTA automatically.",
    },
    {
        q: "Which platforms do you support?",
        a: "Twitter/X. More coming soon.",
    },
];
