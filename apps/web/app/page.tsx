import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ maxWidth: "800px", margin: "3rem auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Welcome to OmniPlug</h1>
      <p style={{ fontSize: "1.25rem", color: "#666", marginBottom: "2rem" }}>
        Multi-platform scheduler + auto-plug engine for Twitter, LinkedIn, Instagram, and Bluesky
      </p>

      <SignedOut>
        <div style={{ marginBottom: "2rem" }}>
          <SignInButton mode="modal">
            <button style={{ 
              padding: "0.75rem 2rem", 
              fontSize: "1.1rem", 
              cursor: "pointer", 
              backgroundColor: "#0070f3", 
              color: "white", 
              border: "none", 
              borderRadius: "0.5rem",
              marginRight: "1rem"
            }}>
              Get Started
            </button>
          </SignInButton>
          <Link href="/dashboard" style={{ 
            padding: "0.75rem 2rem", 
            fontSize: "1.1rem", 
            textDecoration: "none",
            color: "#0070f3",
            border: "1px solid #0070f3",
            borderRadius: "0.5rem",
            display: "inline-block"
          }}>
            Explore Demo
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/dashboard" style={{ 
            padding: "0.75rem 2rem", 
            fontSize: "1.1rem", 
            textDecoration: "none",
            color: "white",
            backgroundColor: "#0070f3",
            borderRadius: "0.5rem",
            display: "inline-block"
          }}>
            Go to Dashboard
          </Link>
        </div>
      </SignedIn>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginTop: "3rem" }}>
        <div style={{ padding: "1.5rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>📅 Schedule Posts</h3>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Plan and publish across all platforms</p>
        </div>
        <div style={{ padding: "1.5rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>🔌 Auto-Plugs</h3>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Automatic engagement-based replies</p>
        </div>
        <div style={{ padding: "1.5rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>📊 Analytics</h3>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Track performance across platforms</p>
        </div>
      </div>
    </div>
  );
}
