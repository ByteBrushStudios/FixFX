import { Banner } from 'fumadocs-ui/components/banner';
import { RootProvider } from "fumadocs-ui/provider";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { inter, jetbrains } from "@/lib/fonts";
import { keywords } from "@utils/index";
import '@/styles/sheet-handle.css';
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "@ui/styles";

export const metadata: Metadata = {
  metadataBase: new URL("https://fixfx.wiki"),
  /** OpenGraph */
  openGraph: {
    type: "website",
    siteName: "FixFX",
    url: "https://fixfx.wiki",
    locale: "en_US",
    creators: ["@CodeMeAPixel"],
    description: "Comprehensive guides and information for the CitizenFX ecosystem.",
  },
  twitter: {
    title: "FixFX",
    card: "summary_large_image",
    creator: "@CodeMeAPixel",
    site: "https://fixfx.wiki",
    description: "Comprehensive guides and information for the CitizenFX ecosystem.",
  },
  /** OpenGraph */

  /** PWA */
  applicationName: "FixFX",
  appleWebApp: {
    statusBarStyle: "default",
    title: "FixFX",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  formatDetection: {
    telephone: false,
  },
  /** PWA */

  title: {
    default: "FixFX",
    template: "%s | FixFX",
  },
  description: "Comprehensive guides and information for the CitizenFX ecosystem.",
  creator: "@CodeMeAPixel",
  authors: {
    url: "https://github.com/CodeMeAPixel",
    name: "Pixelated",
  },
  keywords: keywords,

  /** Icons  */
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  /** Icons  */

  /** Robots */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE ?? undefined,
  },
  /** Robots */
};

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="dark:selection:text-fd-foreground antialiased [text-rendering:optimizeLegibility] selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-800">
        <RootProvider theme="dark">
          {children}
        </RootProvider>
        <Analytics />
        <Script
          async
          src="https://ackee.bytebrush.dev/tracker.js"
          data-ackee-server="https://ackee.bytebrush.dev"
          data-ackee-domain-id="cda143c2-45f9-4884-96b6-9e73ffecaf15"
        />
      </body>
    </html>
  );
}
