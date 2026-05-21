import Link from "next/link";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M3 9.5 Q6 13 8 14 Q11 9 15 4" stroke="#1A3D2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FeatureBuilder() {
  return (
    <section
      id="features"
      aria-labelledby="builder-headline"
      style={{ background: "#EDE8DC", position: "relative" }}
      className="section-pad"
    >
      <div className="container">
        <div className="feature-grid">
          {/* LEFT - Simulated Builder Visual */}
          <div className="feature-visual">
            <div style={{
              background: "#fff",
              border: "1px solid #D4CFC6",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "4px 4px 0 #D4CFC6",
            }}
              role="img"
              aria-label="Formline form builder showing field type sidebar, drag-and-drop canvas with active form fields mid-reorder, and live preview panel"
            >
              <div style={{ background: "#1A3D2B", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>🧩 Builder</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ padding: "2px 10px", background: "rgba(255,255,255,0.15)", borderRadius: 20, fontSize: 11, color: "#8FAF8A" }}>Preview</span>
                  <span style={{ padding: "2px 10px", background: "#8FAF8A", borderRadius: 20, fontSize: 11, color: "#0F0F0E" }}>Publish</span>
                </div>
              </div>
              <div className="feature-mockup-layout">
                <div className="feature-mockup-sidebar" style={{ borderRight: "1px solid #D4CFC6", padding: 12, background: "#F9F8F4" }}>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B6860", marginBottom: 10 }}>Fields</p>
                  {["Short Text", "Email", "Rating", "Yes / No", "Dropdown", "File"].map((f, i) => (
                    <div key={f} style={{
                      padding: "6px 10px", borderRadius: 6, fontSize: 11, marginBottom: 3,
                      background: i === 1 ? "#EDE8DC" : "transparent",
                      border: i === 1 ? "1px solid #D4CFC6" : "1px solid transparent",
                      cursor: "grab",
                    }}>{f}</div>
                  ))}
                </div>
                <div style={{ padding: 16 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B6860", marginBottom: 10 }}>Your Form</p>
                  {["What's your name?", "Your email address"].map((q, i) => (
                    <div key={q} style={{
                      border: `1px solid ${i === 0 ? "#1A3D2B" : "#D4CFC6"}`,
                      borderRadius: 8, padding: "8px 12px", marginBottom: 8, background: "#fff",
                    }}>
                      <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{q}</p>
                      <div style={{ height: 18, background: "#F9F8F4", borderRadius: 4 }} />
                    </div>
                  ))}
                  <div style={{ border: "2px dashed #D4CFC6", borderRadius: 8, padding: 10, textAlign: "center", fontSize: 11, color: "#6B6860" }}>
                    ↓ drop here
                  </div>
                </div>
              </div>
            </div>

            <div className="annotation" style={{ top: -20, left: "30%", transform: "rotate(-2deg)" }}>pick your field type</div>
            <div className="annotation" style={{ bottom: 30, right: -28, transform: "rotate(2deg)" }}>live preview →</div>
            <div className="annotation" style={{ bottom: -18, left: "20%", transform: "rotate(-1deg)" }}>reorders instantly ✓</div>
          </div>

          {/* RIGHT */}
          <div className="feature-text">
            <p className="label-text" style={{ color: "#8FAF8A" }}>DRAG &amp; DROP BUILDER</p>
            <h2 id="builder-headline" className="section-headline" style={{ marginTop: 12 }}>
              Build any form. In minutes, not hours.
            </h2>
            <p style={{ marginTop: 16, color: "#6B6860", fontSize: 16 }}>
              A canvas that works the way your brain does. Grab a field, place it, configure it inline. No modals, no context switching.
            </p>
            <ul className="feature-bullets" aria-label="Builder features">
              {[
                "Drag-and-drop with instant visual feedback",
                "Conditional logic without writing a single rule",
                "Real-time preview on desktop and mobile",
              ].map((item) => (
                <li key={item}><CheckIcon /> <span>{item}</span></li>
              ))}
            </ul>
            <Link href="/signup" className="feature-text-link">
              Try the builder →
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
