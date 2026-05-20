const TESTIMONIALS = [
  {
    quote: "We switched from Typeform last year. Our completion rate went from 41% to 68% in the first month. The difference is almost embarrassing.",
    name: "Sarah Chen",
    role: "Head of Growth",
    company: "Linear",
  },
  {
    quote: "Finally a form tool that doesn't assume I want 47 features I'll never use. It's exactly as powerful as it needs to be, and nothing more.",
    name: "Marcus Webb",
    role: "Indie Maker",
    company: "Maker Weekly",
  },
  {
    quote: "The CSV export is so good I actually look forward to Monday morning data reviews. That's not something I expected to say about a form builder.",
    name: "Priya Nair",
    role: "Product Lead",
    company: "Framer",
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

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="testimonial-card"
              role="figure"
              aria-label={`Testimonial from ${t.name}`}
            >
              {/* Green corner fold */}
              <div style={{
                position: "absolute",
                top: 0, right: 0,
                width: 0, height: 0,
                borderStyle: "solid",
                borderWidth: "0 28px 28px 0",
                borderColor: `transparent #1A3D2B transparent transparent`,
              }} aria-hidden="true" />

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
