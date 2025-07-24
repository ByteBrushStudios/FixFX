"use client"

import * as React from "react"
import { cn } from "@utils/functions/cn"
import { Button } from "@ui/components/button"
import { ScrollArea } from "@ui/components/scroll-area"
import { Home, X, Server, Monitor, Github } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Sheet, SheetContent } from "@ui/components/sheet"
import { Tabs, TabsList, TabsTrigger } from "@ui/components/tabs"
import { NAV_LINKS, DISCORD_LINK, GITHUB_LINK } from "@utils/constants/link"
import { FaDiscord } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/components/tooltip"
import { usePathname } from "next/navigation"

interface ArtifactsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    platform: 'windows' | 'linux';
    onPlatformChange: (platform: 'windows' | 'linux') => void;
}

export function ArtifactsDrawer({
    isOpen,
    onClose,
    platform,
    onPlatformChange
}: ArtifactsDrawerProps) {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<'navigation' | 'platform'>('navigation');

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent
                side="left"
                className="w-[85vw] max-w-md p-0 border-r border-[#5865F2]/20 bg-fd-background"
            >
                <div className="flex flex-col h-full pt-16"> {/* Add pt-16 to account for fixed header */}
                    <div className="flex items-center justify-between p-4 border-b border-[#5865F2]/20">
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
                            <TabsList className="bg-[#0F0B2B]/50 grid grid-cols-2 h-9 w-full">
                                <TabsTrigger value="navigation" className="data-[state=active]:bg-[#5865F2] data-[state=active]:text-white">
                                    Navigation
                                </TabsTrigger>
                                <TabsTrigger value="platform" className="data-[state=active]:bg-[#5865F2] data-[state=active]:text-white">
                                    Platform
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Button variant="ghost" size="icon" onClick={onClose} className="ml-2">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        {activeTab === 'navigation' && (
                            <div className="space-y-1">
                                {NAV_LINKS.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Button
                                            key={item.href}
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start",
                                                pathname === item.href && "bg-[#5865F2]/20 text-[#5865F2]"
                                            )}
                                            asChild
                                            onClick={onClose}
                                        >
                                            {item.external ? (
                                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                    <Icon className="mr-2 h-4 w-4" />
                                                    {item.name}
                                                </a>
                                            ) : (
                                                <Link href={item.href} className="flex items-center">
                                                    <Icon className="mr-2 h-4 w-4" />
                                                    {item.name}
                                                </Link>
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === 'platform' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">Select Server Platform</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <Button
                                            variant={platform === 'windows' ? 'default' : 'outline'}
                                            className={cn(
                                                "py-6 justify-start",
                                                platform === 'windows' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                                            )}
                                            onClick={() => {
                                                onPlatformChange('windows');
                                                onClose();
                                            }}
                                        >
                                            <Monitor className="h-5 w-5 mr-3" />
                                            <div className="text-left">
                                                <div className="font-medium">Windows Server</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    For Windows-based dedicated servers
                                                </div>
                                            </div>
                                        </Button>

                                        <Button
                                            variant={platform === 'linux' ? 'default' : 'outline'}
                                            className={cn(
                                                "py-6 justify-start",
                                                platform === 'linux' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                                            )}
                                            onClick={() => {
                                                onPlatformChange('linux');
                                                onClose();
                                            }}
                                        >
                                            <Server className="h-5 w-5 mr-3" />
                                            <div className="text-left">
                                                <div className="font-medium">Linux Server</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    For Linux-based dedicated servers
                                                </div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-[#0F0B2B]/30 p-4 rounded-lg mt-6">
                                    <h4 className="text-sm font-medium text-white mb-2">Help</h4>
                                    <div className="text-xs text-muted-foreground space-y-2">
                                        <p>Artifacts are server binaries needed to run FiveM or RedM servers.</p>
                                        <p>Different versions have different support levels:</p>
                                        <ul className="list-disc pl-5 space-y-1 mt-2">
                                            <li><span className="text-green-400">Recommended</span> - Best for production</li>
                                            <li><span className="text-blue-400">Latest</span> - Newest version</li>
                                            <li><span className="text-red-400">EOL</span> - No longer supported</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </ScrollArea>

                    {/* Footer with GitHub and Discord links */}
                    <div className="border-t border-[#5865F2]/20 p-3 flex items-center justify-center gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-fd-background/80 hover:bg-[#5865F2]/10 hover:text-[#5865F2] flex-1"
                                        asChild
                                    >
                                        <a
                                            href={GITHUB_LINK}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center"
                                        >
                                            <Github className="h-4 w-4 mr-2" />
                                            <span>GitHub</span>
                                        </a>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>GitHub</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-fd-background/80 hover:bg-[#5865F2]/10 hover:text-[#5865F2] flex-1"
                                        asChild
                                    >
                                        <a
                                            href={DISCORD_LINK}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center"
                                        >
                                            <FaDiscord className="h-4 w-4 mr-2" />
                                            <span>Discord</span>
                                        </a>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>Discord</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
