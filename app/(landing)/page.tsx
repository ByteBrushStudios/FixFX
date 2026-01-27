import { Tracer } from "@ui/core/landing/tracer";
import { Features } from "@ui/core/landing/features";
import { DocsPreview } from "@ui/core/landing/docs-preview";
import { Hero } from "@ui/core/layout/hero";
import { Contributors } from "@ui/core/landing/contributors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FixFX - FiveM & RedM Documentation Hub",
  description:
    "Comprehensive guides, tutorials, and documentation for FiveM, RedM, txAdmin, vMenu, and the CitizenFX ecosystem. Your one-stop resource for server development.",
  alternates: {
    canonical: "https://fixfx.wiki",
  },
  openGraph: {
    title: "FixFX - FiveM & RedM Documentation Hub",
    description:
      "Comprehensive guides, tutorials, and documentation for FiveM, RedM, txAdmin, and the CitizenFX ecosystem.",
    url: "https://fixfx.wiki",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <div className="w-full pt-16 md:pt-24">
        <Hero />
      </div>

      {/* How It Works */}
      <Tracer />

      {/* Features Grid */}
      <Features />

      {/* Documentation Preview */}
      <DocsPreview />

      {/* Contributors */}
      <Contributors />

      {/* Bottom spacing */}
      <div className="h-16 md:h-24" />
    </main>
  );
}
