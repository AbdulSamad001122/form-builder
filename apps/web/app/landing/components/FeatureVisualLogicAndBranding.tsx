import Link from "next/link";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M3 9.5 Q6 13 8 14 Q11 9 15 4" stroke="#1A3D2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FeatureVisualLogicAndBranding() {
  return (
    <section
      id="advanced-features"
      aria-labelledby="advanced-headline"
      style={{ background: "#F9F8F4", position: "relative" }}
      className="section-pad"
    >
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 60px auto" }}>
          <p className="label-text" style={{ color: "#8FAF8A" }}>ENTERPRISE &amp; BRANDING POWER</p>
          <h2 id="advanced-headline" className="section-headline" style={{ marginTop: 12 }}>
            Interactive logic maps and absolute company branding.
          </h2>
          <p style={{ color: "#6B6860", marginTop: 16, fontSize: 16 }}>
            Map complex question branches visually, fully customize public forms with your corporate identity, and secure responses with professional access controls.
          </p>
        </div>

        <div className="feature-grid feature-grid-rev" style={{ marginBottom: 100 }}>
          <div className="feature-text">
            <p className="label-text" style={{ color: "#8FAF8A" }}>VISUAL LOGIC MAPS</p>
            <h3 className="serif" style={{ fontSize: 32, marginTop: 12, lineHeight: 1.2, color: "#0f0f0e" }}>
              Visual branching. Clear, zero-clutter flows.
            </h3>
            <p style={{ marginTop: 16, color: "#6B6860", fontSize: 16 }}>
              Route respondents through personalized paths based on their answers. Use the new "Otherwise" handle to route default steps smoothly without messy, overlapping connection lines.
            </p>
            <ul className="feature-bullets" aria-label="Logic map features">
              {[
                "Drag-and-drop connections between choice-handles and target fields",
                "Clean 'Otherwise' fallback path on every field to avoid messy overlaps",
                "Adaptive and dynamic real-time progress indicators for respondents",
              ].map((item) => (
                <li key={item}><CheckIcon /> <span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div className="feature-visual">
            <div style={{
              background: "#fff",
              border: "1px solid #D4CFC6",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "4px 4px 0 #D4CFC6",
              padding: 24,
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 20,
              backgroundSize: "20px 20px",
              backgroundImage: "radial-gradient(circle, #EDE8DC 1px, transparent 1px)"
            }}
              role="img"
              aria-label="Logic mapper canvas mockup showing nodes connected with beautiful curved routing lines"
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
                <div style={{
                  background: "#fff",
                  border: "2px solid #D4CFC6",
                  borderRadius: 10,
                  width: 170,
                  padding: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  position: "relative"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 8, background: "rgba(26,61,43,0.1)", color: "#1A3D2B", fontWeight: 700, padding: "2px 4px", borderRadius: 4 }}>Q1: CHOOSE</span>
                  </div>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#0F0F0E", marginBottom: 8 }}>Ecosystem?</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {["Webdev", "Mobile"].map((opt) => (
                      <div key={opt} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F9F8F4", padding: "4px 6px", borderRadius: 4, fontSize: 9 }}>
                        <span>{opt}</span>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(107,104,96,0.08)", padding: "4px 6px", borderRadius: 4, fontSize: 9, marginTop: 6 }}>
                    <span style={{ fontStyle: "italic", color: "#6b6860" }}>Otherwise</span>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6b6860" }} />
                  </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M-10 28 C 30 28, 40 40, 95 40" stroke="#6366f1" strokeWidth="2" strokeDasharray="3,3" fill="none" />
                    <path d="M-10 65 C 20 65, 50 65, 95 80" stroke="#6b6860" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                <div style={{
                  background: "#fff",
                  border: "2px solid #D4CFC6",
                  borderRadius: 10,
                  width: 170,
                  padding: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 8, background: "rgba(26,61,43,0.1)", color: "#1A3D2B", fontWeight: 700, padding: "2px 4px", borderRadius: 4 }}>Q2: YES/NO</span>
                  </div>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#0F0F0E" }}>Happy with stack?</p>
                </div>
              </div>
            </div>
            <div className="annotation" style={{ top: -20, right: 40, transform: "rotate(2deg)" }}>Single "Otherwise" fallback wiring</div>
            <div className="annotation" style={{ bottom: -18, left: "20%", transform: "rotate(-1deg)" }}>Adapts dynamically as users type</div>
          </div>
        </div>

        <div className="feature-grid" style={{ marginBottom: 60 }}>
          <div className="feature-visual">
            <div style={{
              background: "#1E293B",
              border: "1px solid #334155",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
              padding: 20,
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
              role="img"
              aria-label="Custom branded public form mockup featuring custom company logo, charcoal color styles, and royal indigo buttons"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: 10 }}>
                <span style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600 }}>✨ Custom Branding Mode</span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, margin: "auto 0" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ background: "#475569", width: 64, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>LOGO</div>
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-serif), serif", fontSize: 18, color: "#F8FAFC" }}>Acme Corp Feedback</h4>
                  <p style={{ fontSize: 11, color: "#94A3B8" }}>Help us craft a beautiful developer workflow.</p>
                </div>
                <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: 12, width: "100%", textAlign: "left" }}>
                  <div style={{ height: 6, width: 80, background: "#94A3B8", borderRadius: 2, marginBottom: 8 }} />
                  <div style={{ height: 16, background: "#1E293B", border: "1px solid #475569", borderRadius: 4 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                  <div style={{ background: "#6366F1", color: "#fff", padding: "6px 14px", borderRadius: 6, fontSize: 10, fontWeight: 600 }}>Next Step →</div>
                </div>
              </div>
            </div>
            <div className="annotation" style={{ top: -20, left: 40, transform: "rotate(-2deg)" }}>Cloudinary secure logo uploads</div>
            <div className="annotation" style={{ bottom: -18, right: 30, transform: "rotate(1deg)" }}>6 color wheels for total design control</div>
          </div>

          <div className="feature-text">
            <p className="label-text" style={{ color: "#8FAF8A" }}>WORKSPACE BRANDING</p>
            <h3 className="serif" style={{ fontSize: 32, marginTop: 12, lineHeight: 1.2, color: "#0f0f0e" }}>
              Total customization. Brand templates.
            </h3>
            <p style={{ marginTop: 16, color: "#6B6860", fontSize: 16 }}>
              Upload your company logo and adjust color aesthetics (Page BG, Card BG, Typography, Input BG, Text, and Borders) using detailed color wheels. Apply saved branding to hide all Formit branding instantly.
            </p>
            <ul className="feature-bullets" aria-label="Branding features">
              {[
                "Logo uploading securely hosted on Cloudinary integration",
                "Branding opt-out settings toggle to switch back to unbranded default none",
                "Real-time client customized workspace mockup preview panel",
              ].map((item) => (
                <li key={item}><CheckIcon /> <span>{item}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{
          background: "#EDE8DC",
          border: "1px solid #D4CFC6",
          borderRadius: 16,
          padding: "32px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 32,
          marginTop: 80
        }}>
          <div>
            <span style={{ fontSize: 20, display: "block", marginBottom: 6 }}>🔒 Security Gates</span>
            <p style={{ fontSize: 13, color: "#6b6860" }}>Password-protect your public forms to gate entry. Only verified respondents with custom authorization tokens can view fields.</p>
          </div>
          <div>
            <span style={{ fontSize: 20, display: "block", marginBottom: 6 }}>⏳ Dynamic Timers &amp; Limits</span>
            <p style={{ fontSize: 13, color: "#6b6860" }}>Establish strict expiration timestamps and submission limit counters. Forms automatically lock when limits are crossed.</p>
          </div>
          <div>
            <span style={{ fontSize: 20, display: "block", marginBottom: 6 }}>🗄️ Archive Workspaces</span>
            <p style={{ fontSize: 13, color: "#6b6860" }}>Clean up your dashboard clutter. Archive old or completed draft forms to a dedicated workspace, keeping active surveys in focus.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
