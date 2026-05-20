"use client";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section
      aria-labelledby="cta-headline"
      className="cta-section grain"
      style={{ position: "relative" }}
    >
      <svg
        style={{ position: "absolute", top: 30, left: "8%", opacity: 0.2 }}
        width="60" height="60" viewBox="0 0 60 60" fill="none"
        aria-hidden="true"
      >
        <path d="M30 5 L32 24 L50 25 L32 30 L36 50 L28 32 L10 35 L26 27 Z" stroke="#8FAF8A" strokeWidth="1.5" fill="none" />
      </svg>
      <svg
        style={{ position: "absolute", bottom: 40, right: "10%", opacity: 0.2 }}
        width="48" height="48" viewBox="0 0 48 48" fill="none"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="20" stroke="#8FAF8A" strokeWidth="1.5" fill="none" strokeDasharray="4 6" />
      </svg>

      <div style={{ position: "relative", zIndex: 2 }}>
        <h2
          id="cta-headline"
          className="section-headline"
          style={{ color: "#fff", textAlign: "center", maxWidth: 600, margin: "0 auto" }}
        >
          Your next form is{" "}
          <span style={{ color: "#8FAF8A", position: "relative", display: "inline-block" }}>
            3 minutes away.
            <svg viewBox="0 0 260 12" preserveAspectRatio="none" style={{ position: "absolute", bottom: -4, left: 0, width: "100%", height: 10 }} aria-hidden="true">
              <path d="M2 7 Q65 2 130 7 Q195 12 258 7" fill="none" stroke="#8FAF8A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </h2>

        <p style={{ textAlign: "center", color: "#8FAF8A", marginTop: 20, fontSize: 16 }}>
          No credit card. No onboarding call. No unnecessary complexity.
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 36 }}>
          <Link href="/register" className="cta-main-btn">
            Start building free →
          </Link>

          <p style={{ fontSize: 14, color: "#8FAF8A" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#fff", fontWeight: 500, textDecoration: "underline" }}>
              Log in →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
