import type { Metadata } from "next";
import localFont from "next/font/local";
import { Instrument_Serif, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import "./landing/landing.css";
import { GlobalProviders } from "~/providers/global";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

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
  title: "Formit — The Form Builder That People Actually Finish",
  description:
    "Build beautiful, high-converting forms in minutes. Drag-and-drop builder, 20+ field types, instant email notifications, real analytics. Free to start.",
  keywords: ["form builder", "Typeform alternative", "drag and drop form builder", "form analytics"],
  openGraph: {
    type: "website",
    title: "Formit — The Form Builder That People Actually Finish",
    description: "Build beautiful, high-converting forms in minutes. 20+ field types, email notifications, real analytics.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${dmSans.variable} ${caveat.variable}`}
        suppressHydrationWarning
      >
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
