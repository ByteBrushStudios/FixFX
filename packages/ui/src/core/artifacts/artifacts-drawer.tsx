"use client"

import * as React from "react"
import { cn } from "@utils/functions/cn"
import { Button } from "@ui/components/button"
import { ScrollArea } from "@ui/components/scroll-area"
import { Home, X, Server, Monitor, Github, Package } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Sheet, SheetContent } from "@ui/components/sheet"
import { Tabs, TabsList, TabsTrigger } from "@ui/components/tabs"
import { NAV_LINKS, DISCORD_LINK, GITHUB_LINK } from "@utils/constants/link"
import { FaDiscord } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/components/tooltip"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

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
                className="w-[85vw] max-w-md p-0 border-r border-[#5865F2]/10 bg-fd-background/95 backdrop-blur-xl"
            >
                <div className="flex flex-col h-full pt-16">
                    <div className="flex items-center justify-between p-4 border-b border-[#5865F2]/10">
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
                            <TabsList className="bg-[#0F0B2B]/60 grid grid-cols-2 h-10 w-full rounded-xl p-1">
                                <TabsTrigger value="navigation" className="rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#5865F2] data-[state=active]:to-[#4752C4] data-[state=active]:text-white data-[state=active]:shadow-md">
                                    Navigation
                                </TabsTrigger>
                                <TabsTrigger value="platform" className="rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#5865F2] data-[state=active]:to-[#4752C4] data-[state=active]:text-white data-[state=active]:shadow-md">
                                    Platform
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Button variant="ghost" size="icon" onClick={onClose} className="ml-2 hover:bg-[#5865F2]/10">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        {activeTab === 'navigation' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-1"
                            >
                                {NAV_LINKS.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "w-full justify-start rounded-lg transition-all duration-200",
                                                    pathname === item.href 
                                                        ? "bg-gradient-to-r from-[#5865F2]/20 to-[#5865F2]/5 text-[#5865F2] border-l-2 border-[#5865F2]" 
                                                        : "hover:bg-[#5865F2]/10"
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
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}

                        {activeTab === 'platform' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">Select Server Platform</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <Button
                                            variant={platform === 'windows' ? 'default' : 'outline'}
                                            className={cn(
                                                "py-5 justify-start rounded-xl transition-all duration-200",
                                                platform === 'windows' 
                                                    ? "bg-gradient-to-br from-[#5865F2] to-[#4752C4] text-white border-none shadow-lg shadow-[#5865F2]/20" 
                                                    : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                            )}
                                            onClick={() => {
                                                onPlatformChange('windows');
                                                onClose();
                                            }}
                                        >
                                            <div className={cn(
                                                "h-10 w-10 rounded-lg flex items-center justify-center mr-3",
                                                platform === 'windows' ? "bg-white/20" : "bg-[#0F0B2B]/60"
                                            )}>
                                                <Monitor className="h-5 w-5" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-medium">Windows Server</div>
                                                <div className={cn(
                                                    "text-xs mt-0.5",
                                                    platform === 'windows' ? "text-white/70" : "text-muted-foreground"
                                                )}>
                                                    Windows-based servers
                                                </div>
                                            </div>
                                        </Button>

                                        <Button
                                            variant={platform === 'linux' ? 'default' : 'outline'}
                                            className={cn(
                                                "py-5 justify-start rounded-xl transition-all duration-200",
                                                platform === 'linux' 
                                                    ? "bg-gradient-to-br from-[#5865F2] to-[#4752C4] text-white border-none shadow-lg shadow-[#5865F2]/20" 
                                                    : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                            )}
                                            onClick={() => {
                                                onPlatformChange('linux');
                                                onClose();
                                            }}
                                        >
                                            <div className={cn(
                                                "h-10 w-10 rounded-lg flex items-center justify-center mr-3",
                                                platform === 'linux' ? "bg-white/20" : "bg-[#0F0B2B]/60"
                                            )}>
                                                <Server className="h-5 w-5" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-medium">Linux Server</div>
                                                <div className={cn(
                                                    "text-xs mt-0.5",
                                                    platform === 'linux' ? "text-white/70" : "text-muted-foreground"
                                                )}>
                                                    Linux-based servers
                                                </div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-[#0F0B2B]/60 to-[#0F0B2B]/30 p-4 rounded-xl mt-4 border border-[#5865F2]/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Package className="h-4 w-4 text-[#5865F2]" />
                                        <h4 className="text-sm font-medium text-white">About Artifacts</h4>
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                                        <p>Server binaries needed to run FiveM or RedM servers.</p>
                                        <div className="space-y-1.5 mt-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                <span><strong className="text-green-400">Recommended</strong> - Best for production</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                <span><strong className="text-blue-400">Latest</strong> - Newest version</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                                <span><strong className="text-red-400">EOL</strong> - No longer supported</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </ScrollArea>

                    {/* Footer with GitHub and Discord links */}
                    <div className="border-t border-[#5865F2]/10 p-3 flex items-center justify-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-fd-background/80 border-[#5865F2]/10 hover:bg-[#5865F2]/10 hover:text-[#5865F2] hover:border-[#5865F2]/20 flex-1 rounded-lg transition-all duration-200"
                                        asChild
                                    >
                                        <a
                                            href={GITHUB_LINK}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center"
                                        >
                                            <Github className="h-4 w-4 mr-2" />
                                            <span className="text-xs">GitHub</span>
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
                                        className="bg-fd-background/80 border-[#5865F2]/10 hover:bg-[#5865F2]/10 hover:text-[#5865F2] hover:border-[#5865F2]/20 flex-1 rounded-lg transition-all duration-200"
                                        asChild
                                    >
                                        <a
                                            href={DISCORD_LINK}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center"
                                        >
                                            <FaDiscord className="h-4 w-4 mr-2" />
                                            <span className="text-xs">Discord</span>
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
