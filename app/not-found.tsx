import { Button } from "@ui/components/button";
import { FaDiscord } from "react-icons/fa";
import { ArrowLeft, Home, Search } from "lucide-react";
import { DISCORD_LINK } from "@utils/constants/link";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-fd-background p-4">
      {/* Gradient background orbs */}
      <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-blue-500/20 blur-[120px] animate-pulse" />
      <div className="absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-purple-500/15 blur-[100px] animate-pulse delay-700" />

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000,transparent)]" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-lg px-4">
        {/* 404 display */}
        <div className="relative mb-6">
          <h1 className="text-[10rem] md:text-[12rem] font-bold leading-none tracking-tighter">
            <span className="bg-gradient-to-b from-fd-foreground to-fd-muted-foreground/50 bg-clip-text text-transparent">
              404
            </span>
          </h1>
          {/* Decorative dots */}
          <div className="absolute -right-2 top-4 h-3 w-3 rounded-full bg-blue-500 animate-ping" />
          <div className="absolute -left-2 bottom-8 h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
        </div>

        {/* Message */}
        <div className="space-y-3 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-fd-foreground">
            Page not found
          </h2>
          <p className="text-fd-muted-foreground text-base md:text-lg leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            asChild
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/docs/core" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Docs
            </Link>
          </Button>
        </div>

        {/* Help link */}
        <p className="mt-8 text-sm text-fd-muted-foreground">
          Need help?{" "}
          <Link
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 transition-colors"
          >
            <FaDiscord className="h-3.5 w-3.5" />
            Join our Discord
          </Link>
        </p>
      </div>
    </div>
  );
}
