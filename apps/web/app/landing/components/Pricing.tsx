import Link from "next/link";

function CheckIcon({ color = "#1A3D2B" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M2.5 8.5 Q5 12 7 13 Q9.5 8.5 13.5 3.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

const PLANS = [
  {
    name: "Free",
    price: "0",
    tagline: "For makers getting started",
    features: ["3 forms", "100 responses/month", "20+ field types", "Email notifications", "CSV export", "Formline branding"],
    cta: "Start for free",
    featured: false,
  },
  {
    name: "Pro",
    price: "12",
    tagline: "For serious builders",
    features: ["Unlimited forms", "Unlimited responses", "Custom domain", "No branding", "Advanced analytics", "Webhooks & integrations", "Priority support"],
    cta: "Start Pro trial",
    featured: true,
  },
  {
    name: "Team",
    price: "39",
    tagline: "For agencies & small teams",
    features: ["Everything in Pro", "5 team members", "Shared form library", "Team analytics dashboard", "GDPR tools", "SLA support", "Custom invoicing"],
    cta: "Talk to us",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-headline"
      className="section-pad"
      style={{ background: "#EDE8DC" }}
    >
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
          <h2 id="pricing-headline" className="section-headline">
            Simple pricing. No calculator needed.
          </h2>
          <p style={{ color: "#6B6860", marginTop: 16, fontSize: 16 }}>
            Pick a plan. Start building. Upgrade when you need more — never before.
          </p>
        </div>

        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card${plan.featured ? " featured" : ""}`}
            >
              {plan.featured && (
                <span className="pricing-badge" aria-label="Most popular plan">
                  ↑ Most popular
                </span>
              )}

              <h3 style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, color: "#0F0F0E" }}>{plan.name}</h3>
              <p style={{ fontSize: 13, color: "#6B6860", marginTop: 4 }}>{plan.tagline}</p>

              <p className="pricing-price">
                ${plan.price}<span>/mo</span>
              </p>

              <ul className="pricing-features" aria-label={`${plan.name} plan features`}>
                {plan.features.map((f) => (
                  <li key={f}>
                    <CheckIcon color={plan.featured ? "#1A3D2B" : "#8FAF8A"} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={plan.featured ? "btn-primary" : "btn-ghost"}
                style={{ width: "100%", textAlign: "center", display: "block" }}
              >
                {plan.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Reassurance */}
        <p style={{ textAlign: "center", marginTop: 36, fontSize: 14, color: "#6B6860", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1.5 L13 4.5 L13 8.5 Q13 12 8 14.5 Q3 12 3 8.5 L3 4.5 Z" stroke="#1A3D2B" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
            <path d="M5.5 8 L7 9.5 L10.5 6" stroke="#1A3D2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All plans include SSL, GDPR tools, and 99.9% uptime SLA.
        </p>
      </div>

    </section>
  );
}
