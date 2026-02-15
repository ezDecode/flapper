import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniPlug",
  description: "Multi-platform scheduler + auto-plug engine"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header style={{ borderBottom: "1px solid #e2e8f0", padding: "0.75rem 1rem", background: "#fff" }}>
            <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <strong>OmniPlug</strong>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/compose">Compose</Link>
              <Link href="/schedule">Schedule</Link>
              <Link href="/analytics">Analytics</Link>
              <Link href="/settings">Settings</Link>
              <div style={{ marginLeft: "auto", display: "flex", gap: "1rem", alignItems: "center" }}>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>Sign In</button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </nav>
          </header>
          <main style={{ padding: "1rem" }}>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}

