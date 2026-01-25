import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components";
import Image from "next/image";
import Link from "next/link";
import { API_URL } from "@/packages/utils/src/constants/link";
import { Github, Heart } from "lucide-react";

interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export async function Contributors() {
  let contributors: Contributor[] = [];

  try {
    // Add timeout to prevent hanging on production when API is unavailable
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_URL}/api/contributors`, {
      signal: controller.signal,
      // Add revalidation for static generation
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        contributors = data;
      }
    }
  } catch (error) {
    // Silently fail - contributors endpoint is optional
    // This happens when API is not available or times out
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn("Contributors API request timeout");
      } else {
        console.warn("Failed to fetch contributors:", error.message);
      }
    }
  }

  // If no contributors or error, use fallback with GitHub org
  if (contributors.length === 0) {
    contributors = [
      {
        id: 1,
        login: "CodeMeAPixel",
        avatar_url: "https://github.com/CodeMeAPixel.png",
        html_url: "https://github.com/CodeMeAPixel",
        contributions: 100,
      },
    ];
  }

  return (
    <section className="w-full max-w-4xl mx-auto py-16 md:py-24 px-4">
      {/* Section header */}
      <div className="text-center mb-10 md:mb-14">
        <span className="inline-flex items-center gap-2 text-pink-500 font-medium text-sm uppercase tracking-wider">
          <Heart className="h-4 w-4 fill-current" />
          Open Source
        </span>
        <h2 className="text-fd-foreground mt-3 text-3xl md:text-4xl font-bold">
          Powered by the Community
        </h2>
        <p className="text-fd-muted-foreground mt-4 max-w-lg mx-auto text-base md:text-lg">
          All the amazing people who helped make this possible.
        </p>
      </div>

      {/* Contributors grid */}
      <TooltipProvider>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {contributors.map((contributor, index) => (
            <a
              key={contributor.id}
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-full ring-2 ring-transparent transition-all duration-300 group-hover:ring-blue-500 group-hover:ring-offset-2 group-hover:ring-offset-fd-background">
                      <Image
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        width={64}
                        height={64}
                        className="h-14 w-14 md:h-16 md:w-16 rounded-full transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    {contributor.contributions > 0 && (
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] md:text-xs font-medium text-white shadow-lg">
                        {contributor.contributions > 99 ? "99+" : contributor.contributions}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="flex items-center gap-2">
                  <span className="font-medium">{contributor.login}</span>
                  {contributor.contributions > 0 && (
                    <span className="text-fd-muted-foreground text-xs">
                      • {contributor.contributions} contributions
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            </a>
          ))}
        </div>
      </TooltipProvider>

      {/* CTA to contribute */}
      <div className="mt-10 md:mt-14 text-center">
        <p className="text-fd-muted-foreground text-sm mb-4">
          Want to contribute to FixFX?
        </p>
        <Link
          href="https://github.com/CodeMeAPixel/FixFX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-medium text-fd-foreground transition-all hover:border-fd-foreground/20 hover:bg-fd-accent/10"
        >
          <Github className="h-4 w-4" />
          View on GitHub
        </Link>
      </div>
    </section>
  );
}
