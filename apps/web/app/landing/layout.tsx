import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, Caveat } from "next/font/google";
import "./landing.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Formline — The Form Builder That People Actually Finish | Free Forever",
  description:
    "Build beautiful, high-converting forms in minutes. Drag-and-drop builder, 20+ field types, instant email notifications, real analytics, and one-click CSV export. Free to start.",
  keywords: ["form builder", "Typeform alternative", "drag and drop form builder", "form analytics", "CSV export form responses"],
  openGraph: {
    type: "website",
    title: "Formline — The Form Builder That People Actually Finish",
    description: "Build beautiful, high-converting forms in minutes. 20+ field types, email notifications, real analytics.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Formline form builder" }],
  },
  twitter: { card: "summary_large_image", title: "Formline", images: ["/og-image.png"] },
  robots: { index: true, follow: true },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} ${caveat.variable}`}
    >
      <body style={{ fontFamily: "var(--font-sans, DM Sans), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
