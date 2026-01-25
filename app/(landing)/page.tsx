import { Tracer } from "@ui/core/landing/tracer";
import { Features } from "@ui/core/landing/features";
import { DocsPreview } from "@ui/core/landing/docs-preview";
import { Hero } from "@ui/core/layout/hero";
import { Contributors } from "@ui/core/landing/contributors";

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
