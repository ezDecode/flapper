import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { DesignSystemProvider } from "@/components/DesignSystemProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flapr",
  description: "Post it. Set it. Flapr does the rest."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <DesignSystemProvider>
          {children}
        </DesignSystemProvider>
        <Analytics />
      </body>
    </html>
  );
}
