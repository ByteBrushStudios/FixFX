"use client"

import { useState } from "react"
import { Button } from "@ui/components/button"
import { Sheet, SheetContent } from "@ui/components/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs"
import { Gamepad2, Monitor, Server, Code } from "lucide-react"
import { cn } from "@utils/functions/cn"
import { ScrollArea } from "@ui/components/scroll-area"
import { Switch } from "@ui/components/switch"
import { Label } from "@ui/components/label"

interface NativesFilterSheetProps {
    isOpen: boolean
    onClose: () => void
    game: 'gta5' | 'rdr3'
    onGameChange: (game: 'gta5' | 'rdr3') => void
    environment: 'all' | 'client' | 'server'
    onEnvironmentChange: (env: 'all' | 'client' | 'server') => void
    categories: string[]
    categoriesByGameAndEnv?: Record<string, Record<string, string[]>> | null
    category: string
    onCategoryChange: (category: string) => void
    includeCFX: boolean
    onToggleCFX: () => void
}

export function NativesFilterSheet({
    isOpen,
    onClose,
    game,
    onGameChange,
    environment,
    onEnvironmentChange,
    categories = [],
    categoriesByGameAndEnv = null,
    category,
    onCategoryChange,
    includeCFX,
    onToggleCFX
}: NativesFilterSheetProps) {
    const [activeTab, setActiveTab] = useState('game')

    // Get the appropriate categories based on current game and environment
    const getRelevantCategories = () => {
        let baseCats: string[] = [];
        if (categoriesByGameAndEnv && categoriesByGameAndEnv[game] && categoriesByGameAndEnv[game][environment]) {
            baseCats = [...categoriesByGameAndEnv[game][environment]];
        } else {
            baseCats = [...categories];
        }

        if (!includeCFX) {
            return baseCats.filter(cat => cat !== 'CFX');
        }

        return baseCats;
    };

    const relevantCategories = getRelevantCategories();

    const serverCategories = relevantCategories.filter(cat =>
        cat === 'NETWORK' ||
        cat === 'PLAYER' ||
        cat === 'ENTITY' ||
        cat === 'VEHICLE' ||
        cat.includes('SERVER') ||
        cat.includes('_SV')
    );

    const clientCategories = relevantCategories.filter(cat =>
        !serverCategories.includes(cat) && cat !== 'CFX'
    );

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent
                side="bottom"
                className="px-0 border-t border-[#5865F2]/20 bg-fd-background/80 backdrop-blur-xl rounded-t-xl overflow-hidden"
                hideCloseButton
                closeOnPointerDown={true}
            >
                {/* Drag handle with better visibility */}
                <div
                    data-drag-handle="true"
                    className="w-full h-10 cursor-grab active:cursor-grabbing flex items-center justify-center relative"
                >
                    <div className="w-16 h-1.5 bg-gray-400/60 rounded-full mx-auto transition-all duration-300 ease-out" />
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#5865F2]/30 to-transparent opacity-70" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
                        <span className="text-xs text-muted-foreground">Drag to dismiss</span>
                    </div>
                </div>

                {/* Rest of the sheet content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full rounded-lg bg-[#0F0B2B]/40 mx-4 mb-6">
                        <TabsTrigger
                            value="game"
                            className="rounded-lg py-3 data-[state=active]:bg-[#5865F2] data-[state=active]:text-white"
                        >
                            Game
                        </TabsTrigger>
                        <TabsTrigger
                            value="environment"
                            className="rounded-lg py-3 data-[state=active]:bg-[#5865F2] data-[state=active]:text-white"
                        >
                            Environment
                        </TabsTrigger>
                        <TabsTrigger
                            value="category"
                            className="rounded-lg py-3 data-[state=active]:bg-[#5865F2] data-[state=active]:text-white"
                        >
                            Category
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="game" className="px-4">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant={game === 'gta5' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-32 flex flex-col items-center justify-center gap-3 rounded-xl",
                                        game === 'gta5' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-md shadow-[#5865F2]/20"
                                    )}
                                    onClick={() => onGameChange('gta5')}
                                >
                                    <div className="h-14 w-14 rounded-full bg-[#0F0B2B] flex items-center justify-center">
                                        <Gamepad2 className="h-8 w-8" />
                                    </div>
                                    <span className="font-medium">GTA V</span>
                                </Button>

                                <Button
                                    variant={game === 'rdr3' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-32 flex flex-col items-center justify-center gap-3 rounded-xl",
                                        game === 'rdr3' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-md shadow-[#5865F2]/20"
                                    )}
                                    onClick={() => onGameChange('rdr3')}
                                >
                                    <div className="h-14 w-14 rounded-full bg-[#0F0B2B] flex items-center justify-center">
                                        <Gamepad2 className="h-8 w-8" />
                                    </div>
                                    <span className="font-medium">RDR3</span>
                                </Button>
                            </div>

                            <div className="bg-[#0F0B2B]/30 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Label htmlFor="cfx-toggle" className="font-medium text-white">
                                        Include CFX Natives
                                    </Label>
                                    <div className="bg-black/20 p-1 rounded-full">
                                        <Switch
                                            id="cfx-toggle"
                                            checked={includeCFX}
                                            onCheckedChange={onToggleCFX}
                                            className="data-[state=checked]:bg-[#5865F2] data-[state=unchecked]:bg-gray-600"
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    CFX natives are specific to the CitizenFX framework and can be used with both games.
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="environment" className="px-4">
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <Button
                                    variant={environment === 'all' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-32 flex flex-col items-center justify-center gap-3 rounded-xl",
                                        environment === 'all' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-md shadow-[#5865F2]/20"
                                    )}
                                    onClick={() => onEnvironmentChange('all')}
                                >
                                    <div className="h-14 w-14 rounded-full bg-[#0F0B2B] flex items-center justify-center">
                                        <Server className="h-8 w-8" />
                                    </div>
                                    <span className="font-medium">All</span>
                                </Button>

                                <Button
                                    variant={environment === 'client' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-32 flex flex-col items-center justify-center gap-3 rounded-xl",
                                        environment === 'client' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-md shadow-[#5865F2]/20"
                                    )}
                                    onClick={() => onEnvironmentChange('client')}
                                >
                                    <div className="h-14 w-14 rounded-full bg-[#0F0B2B] flex items-center justify-center">
                                        <Monitor className="h-8 w-8" />
                                    </div>
                                    <span className="font-medium">Client</span>
                                </Button>

                                <Button
                                    variant={environment === 'server' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-32 flex flex-col items-center justify-center gap-3 rounded-xl",
                                        environment === 'server' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-md shadow-[#5865F2]/20"
                                    )}
                                    onClick={() => onEnvironmentChange('server')}
                                >
                                    <div className="h-14 w-14 rounded-full bg-[#0F0B2B] flex items-center justify-center">
                                        <Server className="h-8 w-8" />
                                    </div>
                                    <span className="font-medium">Server</span>
                                </Button>
                            </div>

                            <div className="bg-[#0F0B2B]/30 p-5 rounded-xl space-y-3">
                                <h4 className="text-sm font-semibold">Environment Info</h4>
                                <ul className="text-sm space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <Monitor className="h-4 w-4 mt-0.5 text-blue-400 shrink-0" />
                                        <span><strong className="text-white">Client</strong> - Runs on player's computer, handles rendering and local game state</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Server className="h-4 w-4 mt-0.5 text-green-400 shrink-0" />
                                        <span><strong className="text-white">Server</strong> - Runs on the game server, handles authoritative game logic and synchronization</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="category">
                        <ScrollArea className="h-[calc(85vh-7rem)]">
                            <div className="px-4 pb-8 space-y-4">
                                <Button
                                    variant={category === '' ? 'default' : 'outline'}
                                    className={cn(
                                        "w-full justify-start rounded-lg",
                                        category === '' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-md shadow-[#5865F2]/20"
                                    )}
                                    onClick={() => onCategoryChange('')}
                                >
                                    <Code className="mr-2 h-4 w-4" />
                                    All Categories
                                </Button>

                                {relevantCategories.includes('CFX') && (
                                    <Button
                                        variant={category === 'CFX' ? 'default' : 'outline'}
                                        className={cn(
                                            "w-full justify-start rounded-lg",
                                            category === 'CFX' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-md shadow-[#5865F2]/20"
                                        )}
                                        onClick={() => onCategoryChange('CFX')}
                                    >
                                        <Code className="mr-2 h-4 w-4 text-[#5865F2]" />
                                        CFX Framework
                                    </Button>
                                )}

                                {serverCategories.length > 0 && environment !== 'client' && (
                                    <div className="space-y-3 mt-6">
                                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Server className="h-4 w-4 text-green-400" />
                                            Server Categories
                                        </h4>
                                        <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {serverCategories.map((cat) => (
                                                <Button
                                                    key={cat}
                                                    variant={category === cat ? 'default' : 'outline'}
                                                    size="sm"
                                                    className={cn(
                                                        "justify-start rounded-lg h-auto py-3",
                                                        category === cat && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-sm shadow-[#5865F2]/20"
                                                    )}
                                                    onClick={() => onCategoryChange(cat)}
                                                >
                                                    <Server className="mr-2 h-4 w-4 text-green-400 shrink-0" />
                                                    <span className="truncate">{cat}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {clientCategories.length > 0 && environment !== 'server' && (
                                    <div className="space-y-3 mt-6">
                                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Monitor className="h-4 w-4 text-blue-400" />
                                            Client Categories
                                        </h4>
                                        <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {clientCategories.map((cat) => (
                                                <Button
                                                    key={cat}
                                                    variant={category === cat ? 'default' : 'outline'}
                                                    size="sm"
                                                    className={cn(
                                                        "justify-start rounded-lg h-auto py-3",
                                                        category === cat && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-sm shadow-[#5865F2]/20"
                                                    )}
                                                    onClick={() => onCategoryChange(cat)}
                                                >
                                                    <Monitor className="mr-2 h-4 w-4 text-blue-400 shrink-0" />
                                                    <span className="truncate">{cat}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}
