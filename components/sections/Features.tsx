"use client";

import { FeatureCard } from "@/components/ui/feature-card";
import { features, C } from "@/lib/landing-data";

export function Features() {
    return (
        <section id="features" className="px-4 py-16 md:px-8 md:py-[4.8rem]">
            <div className="mb-[3.2rem]">
                <h2
                    className="text-[clamp(2.25rem,5vw,3rem)] font-medium tracking-tight leading-[0.94]"
                    style={{ color: C.text }}
                >
                    Let your posts work
                    <br />
                    <span style={{ color: C.textMuted }}>after you log off.</span>
                </h2>
            </div>

            <div className="grid gap-[0.8rem] md:grid-cols-3">
                {features.map((f, i) => (
                    <FeatureCard
                        key={i}
                        icon={f.icon}
                        title={f.title}
                        description={f.desc}
                        className={f.className}
                    />
                ))}
            </div>
        </section>
    );
}
