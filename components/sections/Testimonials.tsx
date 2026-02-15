"use client";

import { testimonials, C } from "@/lib/landing-data";

export function Testimonials() {
    return (
        <section className="px-4 py-20 md:px-8 md:py-24">
            <h2
                className="mb-16 text-center text-[clamp(2rem,4vw,2.5rem)] font-medium tracking-tight leading-[1.034]"
                style={{ color: C.text }}
            >
                Loved by builders who ship.
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
                {testimonials.map((t, i) => (
                    <div
                        key={i}
                        className="flex flex-col justify-between rounded-3xl border p-8"
                        style={{ background: C.bgAlt, borderColor: C.border }}
                    >
                        <p
                            className="text-base leading-relaxed font-normal"
                            style={{ color: C.textSoft }}
                        >
                            &ldquo;{t.quote}&rdquo;
                        </p>
                        <div className="mt-8">
                            <p className="font-medium" style={{ color: C.text }}>
                                {t.name}
                            </p>
                            <p
                                className="text-xs font-normal"
                                style={{ color: C.textMuted }}
                            >
                                {t.role}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
