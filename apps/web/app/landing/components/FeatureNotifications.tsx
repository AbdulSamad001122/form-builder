import Link from "next/link";

function LightningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M11 2 L6 9.5 H10 L7 16 L13 8 H9 Z" stroke="#8FAF8A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function FeatureNotifications() {
  return (
    <section
      aria-labelledby="notifications-headline"
      className="dark-section section-pad grain"
      style={{ position: "relative" }}
    >
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="feature-grid feature-grid-rev">
          {/* LEFT - Text */}
          <div className="feature-text">
            <p className="label-text" style={{ color: "#8FAF8A" }}>EMAIL NOTIFICATIONS</p>
            <h2 id="notifications-headline" className="section-headline" style={{ color: "#fff", marginTop: 12 }}>
              Every submission. Straight to your inbox.
            </h2>
            <p style={{ color: "#C8C4BC", marginTop: 16, fontSize: 16 }}>
              The moment someone submits, you know about it. Configure recipient lists, write custom subjects with merge tags, and send a copy back to the respondent — all without touching code.
            </p>
            <ul className="feature-bullets" style={{ marginTop: 20 }} aria-label="Notification features">
              {[
                "Instant delivery — arrives in under 3 seconds",
                "Dynamic merge tags: {{name}}, {{email}}, {{any_field}}",
                "Respondent confirmation emails with custom branding",
              ].map((item) => (
                <li key={item} style={{ color: "#C8C4BC" }}>
                  <LightningIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/register" className="feature-text-link" style={{ color: "#8FAF8A" }}>
              Set up notifications →
            </Link>
          </div>

          {/* RIGHT - Notification panel mockup */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
              }}
              role="img"
              aria-label="Formline email notification settings showing toggle, recipient email input, custom subject line, merge tag template editor, and send test email button"
            >
              <div style={{ background: "#111", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>⚡ Notification Settings</span>
              </div>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#C8C4BC" }}>Email notifications</span>
                  <div style={{ width: 44, height: 24, background: "#1A3D2B", borderRadius: 12, position: "relative" }}>
                    <div style={{ width: 18, height: 18, background: "#8FAF8A", borderRadius: "50%", position: "absolute", right: 3, top: 3 }} />
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#6B6860", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Recipients</p>
                  <div style={{ background: "#222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#C8C4BC" }}>
                    team@yourcompany.com
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#6B6860", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Subject line</p>
                  <div style={{ background: "#222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#C8C4BC" }}>
                    New response from <span style={{ color: "#8FAF8A" }}>{"{{name}}"}</span>
                  </div>
                </div>
                <div style={{ background: "#1A3D2B", borderRadius: 8, padding: "10px 16px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                  Send test email →
                </div>
              </div>
            </div>

            <div className="annotation annotation-white" style={{ top: -16, right: -16, transform: "rotate(2deg)" }}>
              arrives in &lt; 3 sec ⚡
            </div>
            <div className="annotation annotation-white" style={{ bottom: 40, left: -28, transform: "rotate(-2deg)" }}>
              dynamic fields →
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
