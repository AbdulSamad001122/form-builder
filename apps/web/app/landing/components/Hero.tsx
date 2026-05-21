"use client";
import Link from "next/link";
import { AuthAwareLink } from "~/components/auth-aware-link";

function WavyUnderline({ color = "#1A3D2B" }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      style={{ position: "absolute", bottom: -6, left: 0, width: "100%", height: 12 }}
      aria-hidden="true"
    >
      <path
        d="M2 8 Q25 3 50 8 Q75 13 100 8 Q125 3 150 8 Q175 13 198 8"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M3 9.5 Q6 13 8 14 Q11 9 15 4" stroke="#1A3D2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      className="hero-section container"
      aria-labelledby="hero-headline"
      style={{ position: "relative" }}
    >
      <div className="hero-grid">
        {/* LEFT */}
        <div>
          <h1 id="hero-headline" className="hero-headline">
            Forms that people{" "}
            <span className="hero-accent" style={{ position: "relative" }}>
              actually
              <WavyUnderline />
            </span>{" "}
            finish.
          </h1>

          <p style={{ fontSize: 18, marginTop: 24, color: "#6B6860", fontWeight: 500 }}>
            Drag. Drop. Publish. Get notified. Know your data. No bloat.
          </p>

          <p style={{ marginTop: 16, fontSize: 16, color: "#6B6860", maxWidth: 460, lineHeight: 1.75 }}>
            Formline is the form builder that respects your time and your users&apos; attention.
            No 47-step onboarding. No surprise pricing. Just forms that work.
          </p>

          <div style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap", alignItems: "center" }}>
            <AuthAwareLink href="/signup" className="btn-primary btn-primary-lg">
              Build your first form →
            </AuthAwareLink>
            <Link
              href="/#demo"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#0F0F0E", fontWeight: 500, textDecoration: "none", fontSize: 15 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8 Q6 4 10 8 Q14 12 14 8" stroke="#0F0F0E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M11 5 L14 8 L11 11" stroke="#0F0F0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              See it in action
            </Link>
          </div>

          <div className="social-proof" aria-label="Social proof">
            <div className="avatar-stack" aria-hidden="true">
              <img src="https://github.com/AbdulSamad001122.png" alt="Abdul Samad" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--fl-bg)", display: "block" }} />
            </div>
            <p style={{ fontSize: 14, color: "#6B6860" }}>
              Built with care by <strong style={{ color: "#0F0F0E" }}>Abdul Samad</strong>
            </p>
          </div>
        </div>

        {/* RIGHT — UI Mockup */}
        <div style={{ position: "relative" }}>
          <div className="hero-visual-wrap">
            <div
              style={{
                background: "#fff",
                border: "1px solid #D4CFC6",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              }}
              role="img"
              aria-label="Formline drag-and-drop form builder interface"
            >
              {/* Simulated UI Mockup */}
              <div style={{ background: "#F9F8F4", borderBottom: "1px solid #D4CFC6", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff6058" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                <span style={{ marginLeft: 12, fontSize: 12, color: "#6B6860" }}>formline.io/builder</span>
              </div>
              <div className="hero-mockup-layout">
                <div className="hero-mockup-sidebar" style={{ borderRight: "1px solid #D4CFC6", padding: 16, background: "#F9F8F4" }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B6860", marginBottom: 12 }}>Field Types</p>
                  {["Short Text", "Long Text", "Multiple Choice", "Email", "File Upload", "Rating"].map((f) => (
                    <div key={f} style={{ padding: "8px 10px", borderRadius: 6, fontSize: 12, color: "#0F0F0E", marginBottom: 4, cursor: "grab", border: "1px solid transparent" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#EDE8DC")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {f}
                    </div>
                  ))}
                </div>
                {/* Canvas */}
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B6860" }}>Canvas</p>
                  {[
                    { label: "Your name", type: "text" },
                    { label: "Email address", type: "email" },
                    { label: "How did you hear about us?", type: "choice" },
                  ].map((field) => (
                    <div key={field.label} style={{ border: "1px solid #D4CFC6", borderRadius: 8, padding: "10px 14px", background: "#fff" }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#0F0F0E", marginBottom: 4 }}>{field.label}</p>
                      {field.type === "choice" ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          {["Friend", "Twitter", "Google"].map((o) => (
                            <span key={o} style={{ fontSize: 11, padding: "2px 8px", border: "1px solid #D4CFC6", borderRadius: 20, color: "#6B6860" }}>{o}</span>
                          ))}
                        </div>
                      ) : (
                        <div style={{ height: 22, background: "#F9F8F4", borderRadius: 4, border: "1px solid #D4CFC6" }} />
                      )}
                    </div>
                  ))}
                  <div style={{ border: "2px dashed #D4CFC6", borderRadius: 8, padding: 14, textAlign: "center", color: "#6B6860", fontSize: 12 }}>
                    + Drop field here
                  </div>
                </div>
              </div>
            </div>

            {/* Annotation doodles */}
            <div className="annotation" style={{ top: -16, right: -20, transform: "rotate(2deg)" }}>pick your field →</div>
            <div className="annotation" style={{ bottom: 40, right: -24, transform: "rotate(-1.5deg)" }}>↑ 62% completion rate</div>
            <div className="annotation" style={{ bottom: -16, left: 20, transform: "rotate(1deg)" }}>auto-saves ✓</div>
          </div>
        </div>
      </div>

    </section>
  );
}
