"use client"

import React, { useRef } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@ui/components/sheet";
import { Button } from "@ui/components/button";
import { Check, ChevronDown, Server, ServerCrash } from "lucide-react";
import { cn } from "@utils/functions/cn";

interface PlatformSelectorProps {
    platform: 'windows' | 'linux';
    onPlatformChange: (platform: 'windows' | 'linux') => void;
}

export function PlatformSelector({ platform, onPlatformChange }: PlatformSelectorProps) {
    const [open, setOpen] = React.useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);

    // Handle touch gestures for swiping down to close
    React.useEffect(() => {
        if (!open) return;

        let startY = 0;
        let currentY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            // Get current position
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;

            // Only allow swiping down (positive deltaY)
            if (deltaY > 0) {
                const opacity = Math.max(1 - deltaY / 400, 0);
                const translateY = deltaY / 2;

                if (sheetRef.current) {
                    sheetRef.current.style.transform = `translateY(${translateY}px)`;
                    sheetRef.current.style.opacity = opacity.toString();
                }

                // Prevent default scrolling while swiping
                e.preventDefault();
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const deltaY = currentY - startY;

            // If swiped down more than 100px, close the sheet
            if (deltaY > 100) {
                setOpen(false);
            }

            // Reset styles
            if (sheetRef.current) {
                sheetRef.current.style.transform = '';
                sheetRef.current.style.opacity = '1';
            }
        };

        const element = sheetRef.current;
        if (element) {
            element.addEventListener('touchstart', handleTouchStart);
            element.addEventListener('touchmove', handleTouchMove);
            element.addEventListener('touchend', handleTouchEnd);

            return () => {
                element.removeEventListener('touchstart', handleTouchStart);
                element.removeEventListener('touchmove', handleTouchMove);
                element.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [open]);

    const handlePlatformChange = (newPlatform: 'windows' | 'linux') => {
        onPlatformChange(newPlatform);
        setOpen(false); // Close the sheet after selection
    };

    return (
        <>
            {/* Backdrop blur overlay - shown when sheet is open */}
            {open && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setOpen(false)}
                />
            )}

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-fd-background/50 border-[#5865F2]/20"
                    >
                        {platform === 'windows' ? (
                            <Server className="h-4 w-4 text-[#5865F2]" />
                        ) : (
                            <ServerCrash className="h-4 w-4 text-[#5865F2]" />
                        )}
                        <span className="capitalize">{platform}</span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    ref={sheetRef}
                    side="bottom"
                    className="bg-fd-background border-t border-[#5865F2]/20 z-50 pt-10 pb-8 px-6 rounded-t-xl max-h-[80vh] touch-none"
                    hideCloseButton={true}
                >
                    {/* Visual indicator for swipe down */}
                    <div className="absolute top-0 inset-x-0 flex items-center justify-center pt-2 pb-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30 animate-pulse" />
                    </div>

                    <SheetHeader className="text-left mb-6">
                        <SheetTitle className="text-xl">Select Platform</SheetTitle>
                        <SheetDescription>
                            Choose which server platform you want to view artifacts for
                        </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 overflow-y-auto max-h-[60vh] pb-4">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-between py-6",
                                platform === 'windows' && "border-l-2 border-[#5865F2] bg-[#5865F2]/10"
                            )}
                            onClick={() => handlePlatformChange('windows')}
                        >
                            <div className="flex items-center">
                                <Server className="mr-3 h-5 w-5 text-[#5865F2]" />
                                <div className="text-left">
                                    <p className="font-medium text-base">Windows Server</p>
                                    <p className="text-sm text-muted-foreground">FiveM and RedM Windows builds</p>
                                </div>
                            </div>
                            {platform === 'windows' && <Check className="h-5 w-5 text-[#5865F2]" />}
                        </Button>

                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-between py-6",
                                platform === 'linux' && "border-l-2 border-[#5865F2] bg-[#5865F2]/10"
                            )}
                            onClick={() => handlePlatformChange('linux')}
                        >
                            <div className="flex items-center">
                                <ServerCrash className="mr-3 h-5 w-5 text-[#5865F2]" />
                                <div className="text-left">
                                    <p className="font-medium text-base">Linux Server</p>
                                    <p className="text-sm text-muted-foreground">FiveM and RedM Linux builds</p>
                                </div>
                            </div>
                            {platform === 'linux' && <Check className="h-5 w-5 text-[#5865F2]" />}
                        </Button>

                        <div className="mt-6 bg-fd-background/30 rounded-lg border border-[#5865F2]/20">
                            <div className="p-4">
                                <h4 className="text-sm font-medium mb-2">Artifact Status Guide</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-start gap-2">
                                        <span className="inline-block w-3 h-3 rounded-full bg-green-500 mt-1"></span>
                                        <div>
                                            <p className="font-medium text-green-500">Recommended</p>
                                            <p className="text-muted-foreground">Fully supported, ideal for production use.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mt-1"></span>
                                        <div>
                                            <p className="font-medium text-blue-500">Latest</p>
                                            <p className="text-muted-foreground">Most recent build, for testing only.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="inline-block w-3 h-3 rounded-full bg-cyan-500 mt-1"></span>
                                        <div>
                                            <p className="font-medium text-cyan-500">Active</p>
                                            <p className="text-muted-foreground">Currently supported.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mt-1"></span>
                                        <div>
                                            <p className="font-medium text-amber-500">Deprecated</p>
                                            <p className="text-muted-foreground">Support ended, but still usable.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="inline-block w-3 h-3 rounded-full bg-red-500 mt-1"></span>
                                        <div>
                                            <p className="font-medium text-red-500">EOL</p>
                                            <p className="text-muted-foreground">End of life, no longer supported.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 pb-4 pt-2 border-t border-[#5865F2]/10 text-xs">
                                <p className="text-muted-foreground">
                                    For more information about support policies, visit <a href="https://aka.cfx.re/eol" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:underline">aka.cfx.re/eol</a>
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <h4 className="text-sm font-medium text-amber-500 mb-2">Platform Tips</h4>
                            <ul className="text-xs text-muted-foreground space-y-1.5">
                                <li>• Follow the <a href="https://docs.fivem.net/docs/server-manual/setting-up-a-server/" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:underline">official setup guide</a></li>
                                <li>• Use the recommended artifact for stability</li>
                                <li>• Linux offers better performance but requires more setup</li>
                                <li>• Windows is easier for beginners to configure</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom hint text */}
                    <div className="text-xs text-center text-muted-foreground mt-4">
                        Swipe down or tap outside to close
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
