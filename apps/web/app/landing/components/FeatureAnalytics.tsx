"use client";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1200, triggered = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, triggered]);
  return count;
}

function StatCounter({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(target, 1200, triggered);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setTriggered(true); observer.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stat-pill" ref={ref} role="status" aria-live="polite">
      <span className="stat-number">{count.toLocaleString()}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function FeatureAnalytics() {
  return (
    <section
      aria-labelledby="analytics-headline"
      className="section-pad"
      style={{ background: "#EDE8DC" }}
    >
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <h2 id="analytics-headline" className="section-headline">
            Your form has a story.{" "}
            <span style={{ color: "#1A3D2B", position: "relative", display: "inline-block" }}>
              Here&apos;s how to read it.
              <svg viewBox="0 0 220 12" preserveAspectRatio="none" style={{ position: "absolute", bottom: -6, left: 0, width: "100%", height: 12 }} aria-hidden="true">
                <path d="M2 8 Q55 3 110 8 Q165 13 218 8" fill="none" stroke="#1A3D2B" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p style={{ color: "#6B6860", marginTop: 16, fontSize: 16 }}>
            See exactly where people drop off, which fields take too long, how devices are split — without exporting a thing.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div style={{ marginTop: 52, position: "relative" }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #D4CFC6",
              borderRadius: 16,
              padding: 28,
              boxShadow: "0 12px 48px rgba(0,0,0,0.07)",
            }}
            role="img"
            aria-label="Formline analytics dashboard showing total responses 1842, 68% completion rate, field-by-field drop-off funnel chart, device breakdown donut chart, and 30-day response timeline"
          >
            {/* Top stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Responses", value: "1,842", color: "#1A3D2B" },
                { label: "Completion Rate", value: "68%", color: "#1A3D2B" },
                { label: "Avg. Time", value: "2m 14s", color: "#0F0F0E" },
                { label: "Drop-off Rate", value: "32%", color: "#6B6860" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "#F9F8F4", borderRadius: 10, padding: "16px 20px" }}>
                  <p style={{ fontSize: 11, color: "#6B6860", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{stat.label}</p>
                  <p style={{ fontFamily: "var(--font-serif), serif", fontSize: 28, color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Funnel Chart */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#6B6860", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Field Drop-off</p>
                {[
                  { field: "Name", pct: 98 },
                  { field: "Email", pct: 84 },
                  { field: "Company size", pct: 72 },
                  { field: "Use case", pct: 68 },
                  { field: "Budget range", pct: 51 },
                ].map((row) => (
                  <div key={row.field} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "#0F0F0E" }}>{row.field}</span>
                      <span style={{ color: "#6B6860" }}>{row.pct}%</span>
                    </div>
                    <div style={{ height: 8, background: "#EDE8DC", borderRadius: 4 }}>
                      <div style={{ height: "100%", width: `${row.pct}%`, background: "#1A3D2B", borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#6B6860", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>30-day Responses</p>
                <div style={{ height: 140, display: "flex", alignItems: "flex-end", gap: 4, borderBottom: "1px solid #D4CFC6", paddingBottom: 8 }}>
                  {[30, 45, 28, 62, 51, 88, 72, 95, 60, 43, 78, 92, 55, 40, 67, 83, 71, 49, 85, 100, 76, 58, 90, 64, 73, 88, 52, 95, 80, 68].map((h, i) => (
                    <div key={i} style={{
                      flex: 1,
                      height: `${h}%`,
                      background: h > 80 ? "#1A3D2B" : "#8FAF8A",
                      borderRadius: "2px 2px 0 0",
                      opacity: 0.85,
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: "#6B6860" }}>Apr 20</span>
                  <span style={{ fontSize: 10, color: "#6B6860" }}>May 20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post-it annotations */}
          {[
            { text: "See where people drop off", style: { top: -20, right: 80, transform: "rotate(2deg)" } },
            { text: "Real-time, no refresh ↺", style: { top: 60, right: -24, transform: "rotate(-1.5deg)" } },
            { text: "Export to CSV anytime →", style: { bottom: -18, left: 40, transform: "rotate(1.5deg)" } },
          ].map((note) => (
            <div
              key={note.text}
              className="annotation"
              style={{ ...note.style, position: "absolute" }}
              aria-hidden="true"
            >
              {note.text}
            </div>
          ))}
        </div>

        {/* Stat counters */}
        <div className="stats-row">
          <StatCounter target={1842} label="responses tracked" />
          <StatCounter target={68} label="avg completion rate" suffix="%" />
          <StatCounter target={12} label="metrics per form" />
        </div>
      </div>

    </section>
  );
}
