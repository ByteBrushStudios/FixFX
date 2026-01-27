"use client"

import * as React from "react"
import { Menu, Package } from "lucide-react"
import { Button } from "@ui/components/button"
import { Badge } from "@ui/components/badge"
import { cn } from "@utils/functions/cn"
import { FixFXIcon } from "@/packages/ui/src/icons"
import { motion } from "motion/react"

interface MobileArtifactsHeaderProps {
    onMenuClick: () => void;
    platform: 'windows' | 'linux';
}

export function MobileArtifactsHeader({
    onMenuClick,
    platform
}: MobileArtifactsHeaderProps) {
    return (
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-3 border-b bg-fd-background/95 backdrop-blur-xl border-[#5865F2]/10 z-[100]"
        >
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    className="h-9 w-9 hover:bg-[#5865F2]/10"
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#5865F2]/20 to-[#5865F2]/5">
                        <Package className="h-4 w-4 text-[#5865F2]" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold">Artifacts</h2>
                        <Badge 
                            variant="secondary" 
                            className={cn(
                                "h-4 px-1.5 text-[10px] border-none w-fit",
                                platform === 'windows' ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"
                            )}
                        >
                            {platform === 'windows' ? 'Windows' : 'Linux'}
                        </Badge>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
