import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
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
      <body className={`${instrumentSans.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
