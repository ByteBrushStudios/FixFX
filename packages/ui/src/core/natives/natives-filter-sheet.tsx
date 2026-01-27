"use client"

import { useState } from "react"
import { Button } from "@ui/components/button"
import { Sheet, SheetContent } from "@ui/components/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs"
import { Gamepad2, Monitor, Server, Code, Sparkles, Layers } from "lucide-react"
import { cn } from "@utils/functions/cn"
import { ScrollArea } from "@ui/components/scroll-area"
import { Switch } from "@ui/components/switch"
import { Label } from "@ui/components/label"
import { motion } from "motion/react"

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
                className="px-0 border-t border-[#5865F2]/10 bg-fd-background/95 backdrop-blur-xl rounded-t-2xl overflow-hidden"
                hideCloseButton
                closeOnPointerDown={true}
            >
                {/* Drag handle with better visibility */}
                <div
                    data-drag-handle="true"
                    className="w-full h-10 cursor-grab active:cursor-grabbing flex items-center justify-center relative"
                >
                    <div className="w-12 h-1 bg-gray-500/40 rounded-full mx-auto transition-all duration-300 ease-out" />
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#5865F2]/20 to-transparent" />
                </div>

                {/* Rest of the sheet content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-4 mb-4">
                        <TabsList className="grid grid-cols-3 w-full rounded-xl bg-[#0F0B2B]/60 p-1">
                            <TabsTrigger
                                value="game"
                                className="rounded-lg py-2.5 text-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#5865F2] data-[state=active]:to-[#4752C4] data-[state=active]:text-white data-[state=active]:shadow-md"
                            >
                                Game
                            </TabsTrigger>
                            <TabsTrigger
                                value="environment"
                                className="rounded-lg py-2.5 text-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#5865F2] data-[state=active]:to-[#4752C4] data-[state=active]:text-white data-[state=active]:shadow-md"
                            >
                                Environment
                            </TabsTrigger>
                            <TabsTrigger
                                value="category"
                                className="rounded-lg py-2.5 text-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#5865F2] data-[state=active]:to-[#4752C4] data-[state=active]:text-white data-[state=active]:shadow-md"
                            >
                                Category
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="game" className="px-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-5"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant={game === 'gta5' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-28 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200",
                                        game === 'gta5' 
                                            ? "bg-gradient-to-br from-[#5865F2] to-[#4752C4] text-white border-none shadow-lg shadow-[#5865F2]/30" 
                                            : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                    )}
                                    onClick={() => onGameChange('gta5')}
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                                        game === 'gta5' ? "bg-white/20" : "bg-[#0F0B2B]/60"
                                    )}>
                                        <Gamepad2 className="h-6 w-6" />
                                    </div>
                                    <span className="font-medium text-sm">GTA V</span>
                                </Button>

                                <Button
                                    variant={game === 'rdr3' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-28 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200",
                                        game === 'rdr3' 
                                            ? "bg-gradient-to-br from-[#5865F2] to-[#4752C4] text-white border-none shadow-lg shadow-[#5865F2]/30" 
                                            : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                    )}
                                    onClick={() => onGameChange('rdr3')}
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                                        game === 'rdr3' ? "bg-white/20" : "bg-[#0F0B2B]/60"
                                    )}>
                                        <Gamepad2 className="h-6 w-6" />
                                    </div>
                                    <span className="font-medium text-sm">RDR3</span>
                                </Button>
                            </div>

                            <div className="bg-gradient-to-br from-[#0F0B2B]/60 to-[#0F0B2B]/30 rounded-xl p-4 border border-[#5865F2]/10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-[#5865F2]" />
                                        <Label htmlFor="cfx-toggle-mobile" className="font-medium text-white text-sm">
                                            CFX Natives
                                        </Label>
                                    </div>
                                    <Switch
                                        id="cfx-toggle-mobile"
                                        checked={includeCFX}
                                        onCheckedChange={onToggleCFX}
                                        className="data-[state=checked]:bg-[#5865F2] data-[state=unchecked]:bg-gray-600"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    CitizenFX framework functions for both games.
                                </p>
                            </div>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="environment" className="px-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-5"
                        >
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant={environment === 'all' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-24 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200",
                                        environment === 'all' 
                                            ? "bg-gradient-to-br from-[#5865F2] to-[#4752C4] text-white border-none shadow-lg shadow-[#5865F2]/30" 
                                            : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                    )}
                                    onClick={() => onEnvironmentChange('all')}
                                >
                                    <div className={cn(
                                        "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                                        environment === 'all' ? "bg-white/20" : "bg-[#0F0B2B]/60"
                                    )}>
                                        <Layers className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-xs">All</span>
                                </Button>

                                <Button
                                    variant={environment === 'client' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-24 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200",
                                        environment === 'client' 
                                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg shadow-blue-500/30" 
                                            : "border-[#5865F2]/10 hover:border-blue-500/30 hover:bg-blue-500/5"
                                    )}
                                    onClick={() => onEnvironmentChange('client')}
                                >
                                    <div className={cn(
                                        "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                                        environment === 'client' ? "bg-white/20" : "bg-[#0F0B2B]/60"
                                    )}>
                                        <Monitor className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-xs">Client</span>
                                </Button>

                                <Button
                                    variant={environment === 'server' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-24 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200",
                                        environment === 'server' 
                                            ? "bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg shadow-green-500/30" 
                                            : "border-[#5865F2]/10 hover:border-green-500/30 hover:bg-green-500/5"
                                    )}
                                    onClick={() => onEnvironmentChange('server')}
                                >
                                    <div className={cn(
                                        "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                                        environment === 'server' ? "bg-white/20" : "bg-[#0F0B2B]/60"
                                    )}>
                                        <Server className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-xs">Server</span>
                                </Button>
                            </div>

                            <div className="bg-gradient-to-br from-[#0F0B2B]/60 to-[#0F0B2B]/30 p-4 rounded-xl space-y-3 border border-[#5865F2]/10">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        <span><strong className="text-white">Client</strong> - Player's computer</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span><strong className="text-white">Server</strong> - Game server</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="category">
                        <ScrollArea className="h-[calc(70vh-8rem)]">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="px-4 pb-8 space-y-3"
                            >
                                <Button
                                    variant={category === '' ? 'default' : 'outline'}
                                    className={cn(
                                        "w-full justify-start rounded-xl py-3 transition-all duration-200",
                                        category === '' 
                                            ? "bg-gradient-to-r from-[#5865F2] to-[#4752C4] text-white border-none shadow-md shadow-[#5865F2]/20" 
                                            : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                    )}
                                    onClick={() => onCategoryChange('')}
                                >
                                    <Layers className="mr-2 h-4 w-4" />
                                    All Categories
                                </Button>

                                {relevantCategories.includes('CFX') && (
                                    <Button
                                        variant={category === 'CFX' ? 'default' : 'outline'}
                                        className={cn(
                                            "w-full justify-start rounded-xl py-3 transition-all duration-200",
                                            category === 'CFX' 
                                                ? "bg-gradient-to-r from-[#5865F2] to-[#4752C4] text-white border-none shadow-md shadow-[#5865F2]/20" 
                                                : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                        )}
                                        onClick={() => onCategoryChange('CFX')}
                                    >
                                        <Sparkles className="mr-2 h-4 w-4 text-[#5865F2]" />
                                        CFX Framework
                                    </Button>
                                )}

                                {serverCategories.length > 0 && environment !== 'client' && (
                                    <div className="space-y-2 mt-4">
                                        <h4 className="text-xs font-medium uppercase tracking-wider text-green-400/70 flex items-center gap-1.5 px-1">
                                            <Server className="h-3 w-3" />
                                            Server Categories
                                        </h4>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {serverCategories.map((cat) => (
                                                <Button
                                                    key={cat}
                                                    variant={category === cat ? 'default' : 'ghost'}
                                                    size="sm"
                                                    className={cn(
                                                        "justify-start rounded-lg h-auto py-2.5 transition-all duration-200",
                                                        category === cat 
                                                            ? "bg-gradient-to-r from-green-500/90 to-green-600/90 text-white shadow-sm" 
                                                            : "hover:bg-green-500/10 text-muted-foreground hover:text-white"
                                                    )}
                                                    onClick={() => onCategoryChange(cat)}
                                                >
                                                    <Server className="mr-1.5 h-3 w-3 text-green-400 shrink-0" />
                                                    <span className="truncate text-xs">{cat}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {clientCategories.length > 0 && environment !== 'server' && (
                                    <div className="space-y-2 mt-4">
                                        <h4 className="text-xs font-medium uppercase tracking-wider text-blue-400/70 flex items-center gap-1.5 px-1">
                                            <Monitor className="h-3 w-3" />
                                            Client Categories
                                        </h4>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {clientCategories.map((cat) => (
                                                <Button
                                                    key={cat}
                                                    variant={category === cat ? 'default' : 'ghost'}
                                                    size="sm"
                                                    className={cn(
                                                        "justify-start rounded-lg h-auto py-2.5 transition-all duration-200",
                                                        category === cat 
                                                            ? "bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white shadow-sm" 
                                                            : "hover:bg-blue-500/10 text-muted-foreground hover:text-white"
                                                    )}
                                                    onClick={() => onCategoryChange(cat)}
                                                >
                                                    <Monitor className="mr-1.5 h-3 w-3 text-blue-400 shrink-0" />
                                                    <span className="truncate text-xs">{cat}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}
