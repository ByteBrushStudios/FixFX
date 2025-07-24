"use client"

import { Button } from "@ui/components/button";
import { FaDiscord } from "react-icons/fa";
import { AlertTriangle, RotateCw } from "lucide-react";
import { DISCORD_LINK } from "@utils/constants/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,49,49,0.1),rgba(255,255,255,0))]" />
                        <div className="absolute left-0 top-0 h-32 w-32 animate-pulse rounded-full bg-red-700/20 blur-3xl" />
                        <div className="absolute bottom-0 right-0 h-32 w-32 animate-pulse rounded-full bg-red-700/20 blur-3xl" />
                    </div>

                    {/* Main content */}
                    <div className="relative z-10 flex flex-col items-center justify-center gap-8 text-center">
                        {/* Error text */}
                        <div className="relative">
                            <h1 className="text-8xl font-bold tracking-tighter text-red-700">
                                Fatal Error
                            </h1>
                            <div className="absolute -right-4 -top-4 h-4 w-4 animate-ping rounded-full bg-red-700" />
                            <div className="absolute -bottom-4 -left-4 h-4 w-4 animate-ping rounded-full bg-red-700" />
                        </div>

                        {/* Error icon with animation */}
                        <div className="relative">
                            <AlertTriangle className="h-16 w-16 text-red-700" />
                            <div className="absolute -inset-4 animate-ping rounded-full bg-red-700/20" />
                        </div>

                        {/* Message */}
                        <div className="space-y-2 max-w-md">
                            <h2 className="text-2xl font-bold tracking-tight">
                                Critical Error Occurred
                            </h2>
                            <p className="text-muted-foreground">
                                The application has encountered a fatal error. Please try refreshing the page or contact support if the problem persists.
                            </p>
                            <p className="text-xs text-red-500/80 font-mono">
                                {error.digest}
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Button onClick={reset} variant="destructive" size="default" className="gap-2">
                                <RotateCw className="h-4 w-4" />
                                Refresh Page
                            </Button>

                            <Button asChild variant="outline" size="default">
                                <a
                                    href={DISCORD_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="gap-2"
                                >
                                    <FaDiscord className="h-4 w-4" />
                                    Contact Support
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
                </div>
            </body>
        </html>
    );
}
