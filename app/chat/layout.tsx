import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fixie AI - FiveM & RedM Assistant",
  description:
    "AI-powered assistant for FiveM and RedM development. Get instant help with Lua scripting, txAdmin setup, server configuration, and troubleshooting.",
  keywords: [
    "FiveM AI",
    "RedM AI",
    "txAdmin help",
    "CitizenFX assistant",
    "Lua scripting help",
    "FiveM support",
    "server development help",
  ],
  alternates: {
    canonical: "https://fixfx.wiki/chat",
  },
  openGraph: {
    title: "Fixie AI - FiveM & RedM Assistant | FixFX",
    description:
      "AI-powered assistant for FiveM and RedM development. Get instant help with Lua scripting, txAdmin setup, and more.",
    url: "https://fixfx.wiki/chat",
    type: "website",
  },
};

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
