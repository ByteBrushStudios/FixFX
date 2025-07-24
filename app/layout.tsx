import { Banner } from 'fumadocs-ui/components/banner';
import { RootProvider } from "fumadocs-ui/provider";
import { Analytics } from "@vercel/analytics/react";
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
    siteName: "FixFX",
    url: "https://fixfx.wiki",
    locale: "en_US",
    images: "https://fixfx.wiki/og.png",
    creators: ["@TheRealToxicDev"],
    description: "Comprehensive guides and information for the CitizenFX ecosystem.",
  },
  twitter: {
    title: "FixFX",
    card: "summary_large_image",
    creator: "@TheRealToxicDev",
    site: "https://fixfx.wiki",
    images: "https://fixfx.wiki/og.png",
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
  creator: "@TheRealToxicDev",
  authors: {
    url: "https://github.com/TheRealToxicDev",
    name: "Toxic Dev",
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
      </body>
    </html>
  );
}
