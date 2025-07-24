"use client"

import * as React from "react"
import { cn } from "@utils/functions/cn"
import { Button } from "@ui/components/button"
import { ScrollArea } from "@ui/components/scroll-area"
import { ChevronLeft, ChevronRight, Server, Monitor, InfoIcon, ChevronDown, ChevronUp, Github } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { NAV_LINKS, DISCORD_LINK, GITHUB_LINK } from "@utils/constants/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/components/tooltip"
import { FaDiscord } from "react-icons/fa"
import { FixFXIcon } from "@/packages/ui/src/icons"

interface ArtifactsSidebarProps {
    platform: 'windows' | 'linux';
    onPlatformChange: (platform: 'windows' | 'linux') => void;
}

export function ArtifactsSidebar({
    platform,
    onPlatformChange
}: ArtifactsSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isInfoOpen, setIsInfoOpen] = useState(false)

    return (
        <div className={cn('h-full')}>
            <div className={cn(
                'flex flex-col h-full bg-fd-background backdrop-blur-sm border-r border-[#5865F2]/20 shadow-lg transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-72'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#5865F2]/20">
                    {!isCollapsed && (
                        <Link href="/" className="flex items-center gap-2">
                            <FixFXIcon className="h-5 w-5 text-[#5865F2]" />
                            <span className="font-semibold text-white">Artifact Explorer</span>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn("h-8 w-8", isCollapsed && "ml-auto")}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4 text-[#5865F2]" />
                        ) : (
                            <ChevronLeft className="h-4 w-4 text-[#5865F2]" />
                        )}
                    </Button>
                </div>

                {/* Main Sidebar Content */}
                {isCollapsed ? (
                    /* Collapsed sidebar with just icons */
                    <div className="flex flex-col items-center py-4 space-y-6 flex-1">
                        {/* Platform Selection Icons */}
                        <div className="flex flex-col items-center space-y-2 w-full">
                            <div className="w-8 h-px bg-gray-700/50 my-1"></div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-lg relative",
                                    platform === 'windows' && "bg-[#5865F2]/20 text-[#5865F2]"
                                )}
                                onClick={() => onPlatformChange('windows')}
                            >
                                <Monitor className="h-5 w-5" />
                                {platform === 'windows' && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#5865F2] rounded-full" />
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-lg relative",
                                    platform === 'linux' && "bg-[#5865F2]/20 text-[#5865F2]"
                                )}
                                onClick={() => onPlatformChange('linux')}
                            >
                                <Server className="h-5 w-5" />
                                {platform === 'linux' && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#5865F2] rounded-full" />
                                )}
                            </Button>
                        </div>

                        <div className="mt-auto">
                            {/* Info icon when collapsed */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setIsCollapsed(false);
                                    setIsInfoOpen(true);
                                }}
                                className="h-8 w-8 mb-2"
                            >
                                <InfoIcon className="h-4 w-4 text-[#5865F2]" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <ScrollArea className="flex-1">
                        <div className="space-y-4 p-4">
                            {/* Platform selection */}
                            <div className="space-y-2 pt-4">
                                <h4 className="text-sm font-medium text-muted-foreground px-2">Platform</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={platform === 'windows' ? 'default' : 'outline'}
                                        className={cn(
                                            "py-5",
                                            platform === 'windows' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                                        )}
                                        onClick={() => onPlatformChange('windows')}
                                    >
                                        <Monitor className="h-5 w-5 mr-2" />
                                        Windows
                                    </Button>
                                    <Button
                                        variant={platform === 'linux' ? 'default' : 'outline'}
                                        className={cn(
                                            "py-5",
                                            platform === 'linux' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                                        )}
                                        onClick={() => onPlatformChange('linux')}
                                    >
                                        <Server className="h-5 w-5 mr-2" />
                                        Linux
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 bg-[#0F0B2B]/30 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-white mb-2">Help</h4>
                                <div className="text-xs text-muted-foreground space-y-2">
                                    <p>Artifacts are server binaries needed to run FiveM or RedM servers.</p>
                                    <p>Different versions have different levels of support:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><span className="text-green-400">Recommended</span> - Fully supported, recommended for production use.</li>
                                        <li><span className="text-blue-400">Latest</span> - Most recent build, should be used for testing/beta purposes only.</li>
                                        <li><span className="text-yellow-400">Deprecated</span> - Support ended, but still accessible from the server browser.</li>
                                        <li><span className="text-red-400">EOL</span> - End of life, not supported and inaccessible from the server browser.</li>
                                    </ul>
                                    <p>
                                        For more information about artifact support and status see:{" "}
                                        <Link href="https://aka.cfx.re/eol" className="text-blue-400">aka.cfx.re/eol</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                )}

                {/* Information Footer */}
                {!isCollapsed && (
                    <div className="border-t border-[#5865F2]/20">
                        <Button
                            variant="ghost"
                            className="w-full justify-between px-4 py-3 hover:bg-[#5865F2]/20"
                            onClick={() => setIsInfoOpen(!isInfoOpen)}
                        >
                            <div className="flex items-center gap-2">
                                <InfoIcon className="h-4 w-4 text-[#5865F2]" />
                                <span className="text-white">Info and Links</span>
                            </div>
                            {isInfoOpen ? (
                                <ChevronUp className="h-4 w-4 text-[#5865F2]" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-[#5865F2]" />
                            )}
                        </Button>
                        <div className={cn(
                            "overflow-hidden transition-all duration-300",
                            isInfoOpen ? "max-h-[70vh]" : "max-h-0"
                        )}>
                            <div className="p-4 space-y-4 bg-[#0F0B2B]">
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-white">Server Setup</h4>
                                    <div className="text-xs text-muted-foreground">
                                        <a
                                            href="https://docs.fivem.net/docs/server-manual/setting-up-a-server/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#5865F2] hover:underline"
                                        >
                                            View server setup documentation →
                                        </a>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                <div className="pt-3 border-t border-[#5865F2]/20 space-y-3">
                                    <h4 className="text-sm font-medium text-white">Navigation</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {NAV_LINKS.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Button
                                                    key={item.href}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="justify-start"
                                                    asChild
                                                >
                                                    {item.external ? (
                                                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                            <Icon className="h-3.5 w-3.5 mr-2 text-[#5865F2]" />
                                                            {item.name}
                                                        </a>
                                                    ) : (
                                                        <Link href={item.href} className="flex items-center">
                                                            <Icon className="h-3.5 w-3.5 mr-2 text-[#5865F2]" />
                                                            {item.name}
                                                        </Link>
                                                    )}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer with GitHub and Discord links */}
                <div className={cn(
                    "border-t border-[#5865F2]/20 p-3 flex items-center justify-center gap-3",
                    isCollapsed ? "flex-col" : "flex-row"
                )}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size={isCollapsed ? "icon" : "sm"}
                                    className="bg-fd-background/80 hover:bg-[#5865F2]/10 hover:text-[#5865F2]"
                                    asChild
                                >
                                    <a
                                        href={GITHUB_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            "flex items-center",
                                            !isCollapsed && "w-full justify-center"
                                        )}
                                    >
                                        <Github className="h-4 w-4" />
                                        {!isCollapsed && <span className="ml-2">GitHub</span>}
                                    </a>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className={cn(!isCollapsed && "hidden")}>
                                <p>GitHub</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size={isCollapsed ? "icon" : "sm"}
                                    className="bg-fd-background/80 hover:bg-[#5865F2]/10 hover:text-[#5865F2]"
                                    asChild
                                >
                                    <a
                                        href={DISCORD_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            "flex items-center",
                                            !isCollapsed && "w-full justify-center"
                                        )}
                                    >
                                        <FaDiscord className="h-4 w-4" />
                                        {!isCollapsed && <span className="ml-2">Discord</span>}
                                    </a>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className={cn(!isCollapsed && "hidden")}>
                                <p>Discord</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div >
    );
}
