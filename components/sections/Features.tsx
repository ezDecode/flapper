"use client";

import { FeatureCard } from "@/components/ui/feature-card";
import { features, C } from "@/lib/landing-data";

export function Features() {
    return (
        <section id="features" className="px-4 py-20 md:px-8 md:py-24">
            <div className="mb-16">
                <h2
                    className="text-[clamp(2.25rem,5vw,3rem)] font-medium tracking-tight leading-tight"
                    style={{ color: C.text }}
                >
                    Everything needed to
                    <br />
                    <span style={{ color: C.textMuted }}>convert attention.</span>
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
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
