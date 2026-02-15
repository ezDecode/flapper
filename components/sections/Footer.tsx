"use client";

import Link from "next/link";
import { C } from "@/lib/landing-data";

export function Footer() {
    return (
        <footer className="px-4 py-12 md:px-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <p className="text-sm font-medium" style={{ color: C.textMuted }}>
                    &copy; 2026 Flapr Inc.
                </p>
                <div className="flex gap-6">
                    <Link
                        href="/privacy"
                        className="text-sm font-medium hover:text-white"
                        style={{ color: C.textMuted }}
                    >
                        Privacy
                    </Link>
                    <Link
                        href="/terms"
                        className="text-sm font-medium hover:text-white"
                        style={{ color: C.textMuted }}
                    >
                        Terms
                    </Link>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium hover:text-white"
                        style={{ color: C.textMuted }}
                    >
                        Twitter
                    </a>
                </div>
            </div>
        </footer>
    );
}
