"use client";

import { ArrowRight } from "lucide-react";
import { RaisedButton } from "@/components/ui/raised-button";
import { TwitterXIcon, LinkedInIcon, BlueskyIcon } from "@/components/ui/icons";
import { C } from "@/lib/landing-data";

interface HeroProps {
    onOpenAuth: (tab: "login" | "register") => void;
}

export function Hero({ onOpenAuth }: HeroProps) {
    return (
        <section className="relative flex flex-col items-center justify-center px-4 pt-40 pb-10 text-center md:px-8 md:pt-52 md:pb-16">
            <div
                className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
                style={{
                    borderColor: C.border,
                    color: C.textSoft,
                    background: C.surface,
                }}
            >
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Now in public beta
            </div>

            <h1 className="max-w-4xl text-[clamp(2.5rem,8vw,5rem)] font-medium tracking-tighter leading-[0.66] md:leading-[0.75]">
                <span style={{ color: C.text }}>Let your posts work</span>
                <br />
                <span style={{ color: C.textMuted }}>after you log off.</span>
            </h1>

            <p
                className="mt-8 max-w-xl text-lg leading-relaxed text-balance font-normal"
                style={{ color: C.textSoft }}
            >
                Schedule detailed threads. Set engagement triggers. Flapr replies with
                your CTA exactly when your post takes off — capturing every opportunity
                while you sleep.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                <RaisedButton
                    onClick={() => onOpenAuth("register")}
                    size="lg"
                    color={C.accent}
                    className="h-12 px-8 text-base font-medium"
                >
                    Start for free
                    <ArrowRight className="h-4 w-4" />
                </RaisedButton>
                <div
                    className="flex items-center gap-4 px-4 text-sm font-medium"
                    style={{ color: C.textMuted }}
                >
                    <TwitterXIcon className="h-5 w-5" />
                    <LinkedInIcon className="h-5 w-5" />
                    <BlueskyIcon className="h-5 w-5" />
                </div>
            </div>
        </section>
    );
}
