"use client";

import { Button } from "@ui/components/button";
import { FaDiscord } from "react-icons/fa";
import { RefreshCw, Home, AlertCircle } from "lucide-react";
import { DISCORD_LINK } from "@utils/constants/link";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-fd-background p-4">
      {/* Gradient background orbs - red themed */}
      <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-red-500/20 blur-[120px] animate-pulse" />
      <div className="absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-orange-500/15 blur-[100px] animate-pulse delay-700" />

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000,transparent)]" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-lg px-4">
        {/* Error icon */}
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          {/* Decorative pulse */}
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
        </div>

        {/* Message */}
        <div className="space-y-3 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-fd-foreground">
            Something went wrong
          </h1>
          <p className="text-fd-muted-foreground text-base md:text-lg leading-relaxed">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          {error.digest && (
            <p className="text-xs text-fd-muted-foreground/60 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={reset}
            variant="default"
            size="lg"
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Help link */}
        <p className="mt-8 text-sm text-fd-muted-foreground">
          Still having issues?{" "}
          <Link
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors"
          >
            <FaDiscord className="h-3.5 w-3.5" />
            Get help on Discord
          </Link>
        </p>
      </div>
    </div>
  );
}
