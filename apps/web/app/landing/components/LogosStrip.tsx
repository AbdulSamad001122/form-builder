export default function LogosStrip() {
  const companies = ["Linear", "Loom", "Framer", "Superhuman", "Arc", "Raycast"];
  return (
    <section className="logos-strip" aria-label="Trusted by teams at these companies">
      <p className="label-text" style={{ color: "#6B6860" }}>USED BY BUILDERS AT —</p>
      <div className="logos-strip-names" role="list">
        {companies.map((c) => (
          <span key={c} role="listitem">{c}</span>
        ))}
      </div>
    </section>
  );
}
