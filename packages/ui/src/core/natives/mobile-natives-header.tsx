"use client"

import * as React from "react"
import { Menu, Search, Settings, Code } from "lucide-react"
import { Button } from "@ui/components/button"
import { cn } from "@utils/functions/cn"

interface MobileNativesHeaderProps {
    onMenuClick: () => void;
    onSearchClick: () => void;
    onFilterClick: () => void;
    game: 'gta5' | 'rdr3';
    environment: 'all' | 'client' | 'server';
    searchActive?: boolean;
}

export function MobileNativesHeader({
    onMenuClick,
    onSearchClick,
    onFilterClick,
    game,
    environment,
    searchActive = false
}: MobileNativesHeaderProps) {
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
                    <Code className="h-5 w-5 text-[#5865F2]" />
                    <div className="flex flex-col">
                        <h2 className="text-sm font-medium">Natives</h2>
                        <p className="text-xs text-muted-foreground">
                            {game === 'gta5' ? 'GTA V' : 'RDR3'} ·
                            {environment === 'all' ? ' All' :
                                environment === 'client' ? ' Client' : ' Server'}
                        </p>
                    </div>
                </div>
            </div>
            {!searchActive && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-fd-background/50 border-[#5865F2]/20 h-8 gap-1"
                        onClick={onFilterClick}
                    >
                        <Settings className="h-4 w-4 text-[#5865F2] mr-1" />
                        Filters
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={onSearchClick}
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            )}
        </div>
    )
}
