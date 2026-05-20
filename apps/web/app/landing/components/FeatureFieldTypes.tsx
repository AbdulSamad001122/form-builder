const FIELDS = [
  { name: "Short Text", preview: "Answer here...", tilt: "", dark: false },
  { name: "Long Text", preview: "Type your response...", tilt: "tilted-r", dark: false },
  { name: "Multiple Choice", preview: "○ Option A  ○ Option B", tilt: "", dark: false },
  { name: "Dropdown", preview: "Select one ▾", tilt: "tilted-l", dark: false },
  { name: "File Upload", preview: "Browse or drag & drop", tilt: "", dark: true },
  { name: "Date Picker", preview: "MM / DD / YYYY", tilt: "tilted-r", dark: false },
  { name: "Star Rating", preview: "★ ★ ★ ☆ ☆", tilt: "", dark: false },
  { name: "NPS Scale", preview: "0 — — — — 10", tilt: "tilted-l", dark: false },
  { name: "Yes / No Toggle", preview: "YES  |  NO", tilt: "", dark: false },
  { name: "Phone", preview: "+1 (555) ...", tilt: "tilted-r", dark: false },
  { name: "Email", preview: "you@email.com", tilt: "", dark: false },
  { name: "Signature", preview: "✍ Sign here", tilt: "tilted-l", dark: true },
  { name: "Consent Checkbox", preview: "☐ I agree to...", tilt: "", dark: false },
  { name: "Payment", preview: "💳 Card details", tilt: "tilted-r", dark: true },
  { name: "Hidden Field", preview: "{ key: value }", tilt: "", dark: false },
  { name: "Section Divider", preview: "— — — — —", tilt: "tilted-l", dark: false },
];

export default function FeatureFieldTypes() {
  return (
    <section
      aria-labelledby="fields-headline"
      className="section-pad"
      style={{ background: "#F9F8F4" }}
    >
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
          <h2 id="fields-headline" className="section-headline">
            20+ field types. Every answer has a home.
          </h2>
          <p style={{ color: "#6B6860", marginTop: 16, fontSize: 16 }}>
            From a simple name field to payment collection and e-signatures — your form can handle anything.
          </p>
        </div>

        <div className="fields-grid" role="list" aria-label="Available form field types">
          {FIELDS.map((field) => (
            <div
              key={field.name}
              className={`field-card ${field.tilt} ${field.dark ? "dark" : ""}`}
              role="listitem"
              aria-label={`${field.name} form field`}
            >
              <p className={`field-name ${field.dark ? "" : ""}`} style={field.dark ? { color: "#fff" } : {}}>
                {field.name}
              </p>
              <p className={`field-preview${field.dark ? " dark" : ""}`}>
                {field.preview}
              </p>
            </div>
          ))}

          {/* Addmore card */}
          <div className="field-add-card" aria-label="More field types coming soon">
            <span aria-hidden="true">+</span>
            <p className="add-label caveat">...adding more monthly →</p>
          </div>
        </div>
      </div>

    </section>
  );
}
