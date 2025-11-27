import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelAcross EU — AI travel guides for every EU locale",
  description:
    "Plan city breaks, coastal escapes, and cultural trips with AI-generated guides in five EU languages.",
  openGraph: {
    title: "TravelAcross EU — AI travel guides for every EU locale",
    description:
      "Hybrid light/dark experience that showcases multilingual destinations, planning workflows, and future add-ons like flights and hotels.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelAcross EU — AI travel guides for every EU locale",
    description:
      "Discover AI-crafted EU itineraries, explore destination themes, and prep for future flights and hotel integrations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
