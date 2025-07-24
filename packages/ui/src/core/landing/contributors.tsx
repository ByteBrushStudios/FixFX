import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components";
import Image from "next/image";
import { ENV_URL } from "@/packages/utils/src/constants/link";

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
    const response = await fetch(`${ENV_URL}/api/contributors`);

    if (response.ok) {
      contributors = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch contributors:", error);
  }

  // If no contributors or error, use mock data
  if (contributors.length === 0) {
    contributors = [
      {
        id: 1,
        login: "FixFX",
        avatar_url: "https://github.com/FixFXOSS.png",
        html_url: "https://github.com/FixFXOSS",
        contributions: 100,
      },
    ];
  }

  return (
    <section className="mt-12 text-center">
      <h2 className="text-fd-muted-foreground select-none text-xl font-medium uppercase">
        Open Source
      </h2>
      <h3 className="text-fd-foreground my-1 text-wrap text-3xl font-semibold">
        Powered by the Community
      </h3>
      <h4 className="text-fd-muted-foreground mt-1.5 max-w-lg text-pretty text-xl italic">
        All the amazing people who helped make this possible.
      </h4>
      <TooltipProvider>
        <div className="mt-12 flex flex-row flex-wrap items-center justify-center gap-4">
          {contributors.map((contributor) => (
            <a
              key={contributor.id}
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tooltip>
                <TooltipTrigger>
                  <div className="relative">
                    <Image
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      width={75}
                      height={75}
                      className="border-border transform rounded-full border transition hover:scale-110"
                    />
                    {contributor.contributions > 0 && (
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-fd-accent px-2 py-1 text-xs text-white">
                        {contributor.contributions}
                      </div>
                    )}
                  </div>
                  <TooltipContent className="mb-1.5">
                    {contributor.login}
                    {contributor.contributions > 0 && (
                      <span className="ml-1 text-fd-muted-foreground">
                        ({contributor.contributions} contributions)
                      </span>
                    )}
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </a>
          ))}
        </div>
      </TooltipProvider>
    </section>
  );
}
