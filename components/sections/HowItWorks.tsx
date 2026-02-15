"use client";

import { steps, C } from "@/lib/landing-data";

export function HowItWorks() {
    return (
        <section id="how-it-works" className="px-4 py-20 md:px-8 md:py-24">
            <div className="grid gap-16 lg:grid-cols-2">
                <div className="self-start lg:sticky lg:top-32">
                    <h2
                        className="text-[clamp(2.25rem,5vw,3rem)] font-medium tracking-tight leading-tight"
                        style={{ color: C.text }}
                    >
                        Three steps.
                        <br />
                        <span style={{ color: C.textMuted }}>Zero friction.</span>
                    </h2>
                    <p
                        className="mt-6 text-lg font-normal"
                        style={{ color: C.textSoft }}
                    >
                        Stop gluing together Zapier, Buffer, and makeshift scripts. Flapr
                        handles the entire lifecycle of a viral post in one cohesive
                        workflow.
                    </p>
                </div>

                <div className="space-y-8">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="relative rounded-3xl border p-8"
                            style={{ background: C.surface, borderColor: C.border }}
                        >
                            <span
                                className="mb-4 block text-xs font-medium uppercase tracking-wider"
                                style={{ color: C.accent }}
                            >
                                Step {step.num}
                            </span>
                            <h3
                                className="mb-2 text-2xl font-medium"
                                style={{ color: C.text }}
                            >
                                {step.title}
                            </h3>
                            <p
                                className="text-base font-normal"
                                style={{ color: C.textSoft }}
                            >
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
