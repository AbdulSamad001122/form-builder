"use client";
import Link from "next/link";
import { AuthAwareLink } from "~/components/auth-aware-link";
import { useEffect, useRef, useState } from "react";

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="22" height="22" rx="4" stroke="#1A3D2B" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      <line x1="8" y1="10" x2="20" y2="10.3" stroke="#1A3D2B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="14.5" x2="18" y2="14.2" stroke="#1A3D2B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="19" x2="15" y2="19.1" stroke="#1A3D2B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setScrolled(!entry.isIntersecting);
        }
      },
      { threshold: 1 }
    );
    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => { if (sentinel) observer.unobserve(sentinel); };
  }, []);

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1, position: "absolute", top: 0 }} aria-hidden="true" />
      <nav aria-label="Main navigation" className={`fl-nav${scrolled ? " scrolled" : ""}`}>
        <div className="fl-nav-inner">
          <Link href="/" className="fl-logo">
            <LogoIcon />
            Formit
          </Link>

          <ul className="fl-nav-links" role="list">
            {["Features", "Pricing", "Docs", "Changelog"].map((item) => (
              <li key={item}>
                <Link href={`/#${item.toLowerCase()}`}>{item}</Link>
              </li>
            ))}
          </ul>

          <div className="fl-nav-actions">
            <AuthAwareLink href="/login" className="btn-ghost">Log in</AuthAwareLink>
            <AuthAwareLink href="/signup" className="btn-primary">Start free →</AuthAwareLink>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            className="fl-menu-toggle"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 5 L19 19" stroke="#0F0F0E" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M19 5 L5 19" stroke="#0F0F0E" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6.5 Q12 5.8 20 6.5" stroke="#0F0F0E" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 12 Q12 11.5 20 12" stroke="#0F0F0E" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 17.5 Q12 17 20 17.5" stroke="#0F0F0E" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
        {mobileOpen && (
          <div className="fl-mobile-menu">
            <ul className="fl-mobile-nav-links" role="list">
              {["Features", "Pricing", "Docs", "Changelog"].map((item) => (
                <li key={item}>
                  <Link href={`/#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)}>{item}</Link>
                </li>
              ))}
            </ul>
            <div className="fl-mobile-nav-actions">
              <AuthAwareLink href="/login" className="btn-ghost" onClick={() => setMobileOpen(false)}>Log in</AuthAwareLink>
              <AuthAwareLink href="/signup" className="btn-primary" onClick={() => setMobileOpen(false)}>Start free →</AuthAwareLink>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
