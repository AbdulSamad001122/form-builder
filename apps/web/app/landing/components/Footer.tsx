import Link from "next/link";

const NAV = {
  Product: ["Builder", "Field Types", "Analytics", "Integrations", "API", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press Kit", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Settings", "GDPR"],
};

function LogoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="#1A3D2B" strokeWidth="1.8" fill="none" />
      <line x1="7" y1="9" x2="17" y2="9.2" stroke="#1A3D2B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="12.5" x2="15" y2="12.3" stroke="#1A3D2B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="16" x2="12" y2="16.1" stroke="#1A3D2B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer role="contentinfo" className="footer">
      {/* Wobbly top border */}

      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand */}
          <div>
            <Link href="/landing" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#0F0F0E" }}>
              <LogoIcon />
              <span style={{ fontFamily: "var(--font-serif), serif", fontSize: 20 }}>Formline</span>
            </Link>
            <p style={{ marginTop: 12, fontFamily: "var(--font-serif), serif", fontStyle: "italic", color: "#6B6860", fontSize: 16 }}>
              Forms with intention.
            </p>
            <div className="social-icons" aria-label="Social media links">
              {[
                {
                  label: "Follow Formline on X (Twitter)",
                  path: "M4 4 L20 20 M20 4 L4 20",
                },
                {
                  label: "Connect on LinkedIn",
                  path: "M4 4 h4 v12 h-4 z M10 8 Q14 6 16 10 v6 h-4 v-5 Q12 8 10 9 z M4 2 h4 v3 h-4 z",
                },
                {
                  label: "Formline on GitHub",
                  path: "M12 3 Q6 3 6 9 Q6 13 9 14.5 Q9 16 9 17 Q7 17 6 15.5 Q5 13.5 4 14 Q6 16 7 17 L9 17 Q9 19 12 19 Q15 19 15 17 L17 17 Q18 16 20 14 Q19 13.5 18 15.5 Q17 17 15 17 Q15 16 15 14.5 Q18 13 18 9 Q18 3 12 3 Z",
                },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d={s.path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(NAV).map(([section, links]) => (
            <div key={section}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "#0F0F0E", marginBottom: 16 }}>{section}</h3>
              <ul className="footer-links" role="list">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© 2025 Formline. All rights reserved.</p>
          <p>Made with ☕ and too many form fields.</p>
        </div>
      </div>
    </footer>
  );
}
