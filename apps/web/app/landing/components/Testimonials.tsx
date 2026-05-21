const TESTIMONIALS = [
  {
    quote: "I built Formline to solve my own frustration with bloated, complex form builders. It is designed to be simple, fast, and exactly as powerful as it needs to be.",
    name: "Abdul Samad",
    role: "Creator",
    company: "Formline",
    image: "https://github.com/AbdulSamad001122.png",
  },
];

export default function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-headline"
      className="section-pad"
      style={{ background: "#F9F8F4" }}
    >
      <div className="container">
        <h2 id="testimonials-headline" className="section-headline" style={{ textAlign: "center" }}>
          People stopped using Typeform.{" "}
          <span style={{ color: "#1A3D2B" }}>Here&apos;s why.</span>
        </h2>

        <div className="testimonials-grid" style={{ gridTemplateColumns: "1fr", maxWidth: 600, margin: "0 auto" }}>
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="testimonial-card"
              role="figure"
              aria-label={`A note from ${t.name}`}
            >
              <div style={{
                position: "absolute",
                top: 0, right: 0,
                width: 0, height: 0,
                borderStyle: "solid",
                borderWidth: "0 28px 28px 0",
                borderColor: `transparent #1A3D2B transparent transparent`,
              }} aria-hidden="true" />
              <img src={t.image} alt={t.name} style={{ width: 48, height: 48, borderRadius: "50%", marginBottom: 16 }} />
              <blockquote>
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
              <footer style={{ marginTop: 20 }}>
                <cite>{t.name}</cite>
                <p style={{ marginTop: 2 }}>{t.role}, {t.company}</p>
              </footer>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}
