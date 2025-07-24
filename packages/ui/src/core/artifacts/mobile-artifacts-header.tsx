"use client"

import * as React from "react"
import { Menu, Server } from "lucide-react"
import { Button } from "@ui/components/button"
import { cn } from "@utils/functions/cn"
import { FixFXIcon } from "@/packages/ui/src/icons"

interface MobileArtifactsHeaderProps {
    onMenuClick: () => void;
    platform: 'windows' | 'linux';
}

export function MobileArtifactsHeader({
    onMenuClick,
    platform
}: MobileArtifactsHeaderProps) {
    return (
        <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between p-4 border-b bg-fd-background/95 backdrop-blur-md border-[#5865F2]/20 z-[100]">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    className="md:hidden"
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <FixFXIcon className="h-5 w-5 text-[#5865F2]" />
                    <div className="flex flex-col">
                        <h2 className="text-sm font-medium">Artifact Explorer</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}
