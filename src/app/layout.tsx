import type { Metadata } from "next";
import { Source_Sans_3, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import ServiceWorker from "./components/ServiceWorker";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
  weight: ["400", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-tiempos",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Timeline — What Happened Today",
  description: "Daily updates from the AI world. Models, labs, and breakthroughs. Automatically curated.",
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192' },
      { url: '/icon-512x512.png', sizes: '512x512' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <ThemeProvider>
          <KeyboardShortcuts />
          <ServiceWorker />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
