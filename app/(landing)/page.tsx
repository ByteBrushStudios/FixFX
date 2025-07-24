import { Tracer } from "@ui/core/landing/tracer";
import { Features } from "@ui/core/landing/features";
import { DocsPreview } from "@ui/core/landing/docs-preview";
import { Hero } from "@ui/core/layout/hero";
import { Contributors } from "@ui/core/landing/contributors";

export default function HomePage() {
  return (
    <div className="mx-8 flex min-h-screen flex-col items-center justify-center py-16">
      <Hero />
      <Tracer />
      <Features />
      <Contributors />
    </div>
  );
}
