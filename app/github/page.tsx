import { GITHUB_ORG } from "@/packages/utils/src";
import { Button } from "@ui/components/button";
import { FaDiscord } from "react-icons/fa";
import { Gamepad2 } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function DiscordPage() {
  redirect(GITHUB_ORG);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,101,242,0.1),rgba(255,255,255,0))]" />
        <div className="absolute left-0 top-0 h-32 w-32 animate-pulse rounded-full bg-[#5865F2]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-32 w-32 animate-pulse rounded-full bg-[#5865F2]/20 blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 text-center">
        {/* Discord icon with animation */}
        <div className="relative">
          <FaDiscord className="h-16 w-16 text-[#5865F2]" />
          <div className="absolute -inset-4 animate-ping rounded-full bg-[#5865F2]/20" />
        </div>

        {/* Gamepad icon with animation */}
        <div className="relative">
          <Gamepad2 className="h-16 w-16 text-primary" />
          <div className="absolute -inset-4 animate-ping rounded-full bg-primary/20" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Follow us on GitHub
          </h2>
          <p className="text-muted-foreground">
            You should be redirected to our GitHub automatically. If not, click the button below!
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-center gap-4">
          <Button asChild variant="default" size="default">
            <Link
              href={GITHUB_ORG}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2 bg-[#5865F2] hover:bg-[#5865F2]/90"
            >
              <FaDiscord className="h-4 w-4" />
              Check out our GitHub
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
