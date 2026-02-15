import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "../public/fonts/InterVariable.ttf",
  variable: "--font-inter",
  display: "swap",
  weight: "400 500",
});

export const metadata: Metadata = {
  title: "Flapr",
  description: "Post it. Set it. Flapr does the rest."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html >
  );
}
