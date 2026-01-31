import type { Metadata } from "next";
import { Syne, Literata, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import ServiceWorker from "./components/ServiceWorker";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AI TIMELINE — What Happened Today",
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
    <html lang="en" className={`${syne.variable} ${literata.variable} ${spaceMono.variable}`}>
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
