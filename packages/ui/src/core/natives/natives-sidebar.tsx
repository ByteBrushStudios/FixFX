"use client"

import * as React from "react"
import { cn } from "@utils/functions/cn"
import { Button } from "@ui/components/button"
import { ScrollArea } from "@ui/components/scroll-area"
import { Settings, ChevronLeft, ChevronRight, Code, Gamepad2, Monitor, Server, ChevronUp, ChevronDown, ToggleRight, ToggleLeft, Search, Home, InfoIcon, Sparkles, Layers } from "lucide-react"
import Link from "next/link"
import { useState, useCallback, useRef, useEffect } from "react"
import { NAV_LINKS } from "@utils/constants/link"
import { Switch } from "@ui/components/switch"
import { Label } from "@ui/components/label"
import { motion, AnimatePresence } from "motion/react"

interface NativesSidebarProps {
    game: 'gta5' | 'rdr3';
    onGameChange: (game: 'gta5' | 'rdr3') => void;
    environment: 'all' | 'client' | 'server';
    onEnvironmentChange: (env: 'all' | 'client' | 'server') => void;
    categories: string[];
    categoriesByGameAndEnv?: Record<string, Record<string, string[]>> | null;
    category: string;
    onCategoryChange: (category: string) => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    includeCFX: boolean;
    onToggleCFX: () => void;
}

export function NativesSidebar({
    game,
    onGameChange,
    environment,
    onEnvironmentChange,
    categories = [],
    categoriesByGameAndEnv = null,
    category,
    onCategoryChange,
    searchQuery,
    onSearchQueryChange,
    includeCFX,
    onToggleCFX
}: NativesSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isInfoOpen, setIsInfoOpen] = useState(false)
    const [searchValue, setSearchValue] = useState(searchQuery)

    // Add a debounce timer ref to avoid excessive API calls
    const searchDebounceRef = useRef<NodeJS.Timeout | null>(null)

    // Modified search input handler to update in real time with debounce
    const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSearchValue(newValue)

        // Clear existing timeout
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current)
        }

        // Set new timeout to update search after 300ms of inactivity
        searchDebounceRef.current = setTimeout(() => {
            onSearchQueryChange(newValue)
        }, 300)
    }, [onSearchQueryChange])

    // Clean up any outstanding timeouts when component unmounts
    useEffect(() => {
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current)
            }
        }
    }, [])

    // Keep the original form handler for direct submit via button or Enter key
    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()

        // Clear any pending debounce to prevent duplicate searches
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current)
            searchDebounceRef.current = null
        }

        onSearchQueryChange(searchValue)
    }, [searchValue, onSearchQueryChange])

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

    // Improved category sorting - Make CFX special
    const cfxCategory = relevantCategories.includes('CFX') ? ['CFX'] : [];

    // Enhanced server category detection
    const serverCategories = relevantCategories.filter(cat =>
        cat !== 'CFX' && (
            cat === 'NETWORK' ||
            cat === 'PLAYER' ||
            cat === 'ENTITY' ||
            cat === 'VEHICLE' ||
            cat.includes('SERVER') ||
            cat.includes('_SV')
        )
    );

    // Everything else is client
    const clientCategories = relevantCategories.filter(cat =>
        cat !== 'CFX' && !serverCategories.includes(cat)
    );

    // Sort categories alphabetically within their groups
    const sortedServerCategories = [...serverCategories].sort();
    const sortedClientCategories = [...clientCategories].sort();

    return (
        <div className={cn('h-full')}>
            <motion.div 
                initial={{ width: isCollapsed ? '4rem' : '18rem' }}
                animate={{ width: isCollapsed ? '4rem' : '18rem' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={cn(
                    'flex flex-col h-full bg-fd-background/95 backdrop-blur-xl border-r border-[#5865F2]/10 shadow-2xl shadow-[#5865F2]/5'
                )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#5865F2]/10">
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link href="/" className="flex items-center gap-2.5 group">
                                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#5865F2]/20 to-[#5865F2]/5 group-hover:from-[#5865F2]/30 group-hover:to-[#5865F2]/10 transition-all duration-300">
                                        <Code className="h-4 w-4 text-[#5865F2]" />
                                    </div>
                                    <span className="font-semibold text-white">Natives</span>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn("h-8 w-8 hover:bg-[#5865F2]/10", isCollapsed && "ml-auto")}
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
                    <div className="flex flex-col items-center py-4 space-y-6">
                        {/* Search Icon */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-white"
                            onClick={() => setIsCollapsed(false)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Game Selection Icons */}
                        <div className="flex flex-col items-center space-y-2 w-full">
                            <div className="w-8 h-px bg-gray-700/50 my-1" />
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-lg relative",
                                    game === 'gta5' && "bg-[#5865F2]/20 text-[#5865F2]"
                                )}
                                onClick={() => onGameChange('gta5')}
                            >
                                <Gamepad2 className="h-5 w-5" />
                                {game === 'gta5' && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#5865F2] rounded-full" />
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-lg relative",
                                    game === 'rdr3' && "bg-[#5865F2]/20 text-[#5865F2]"
                                )}
                                onClick={() => onGameChange('rdr3')}
                            >
                                <Gamepad2 className="h-5 w-5" />
                                {game === 'rdr3' && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#5865F2] rounded-full" />
                                )}
                            </Button>
                        </div>

                        {/* Environment Selection Icons */}
                        <div className="flex flex-col items-center space-y-2 w-full">
                            <div className="w-8 h-px bg-gray-700/50 my-1" />
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-lg relative",
                                    environment === 'all' && "bg-[#5865F2]/20 text-[#5865F2]"
                                )}
                                onClick={() => onEnvironmentChange('all')}
                            >
                                <Code className="h-5 w-5" />
                                {environment === 'all' && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#5865F2] rounded-full" />
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-lg relative",
                                    environment === 'client' && "bg-[#5865F2]/20 text-[#5865F2]"
                                )}
                                onClick={() => onEnvironmentChange('client')}
                            >
                                <Monitor className="h-5 w-5" />
                                {environment === 'client' && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#5865F2] rounded-full" />
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-lg relative",
                                    environment === 'server' && "bg-[#5865F2]/20 text-[#5865F2]"
                                )}
                                onClick={() => onEnvironmentChange('server')}
                            >
                                <Server className="h-5 w-5" />
                                {environment === 'server' && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#5865F2] rounded-full" />
                                )}
                            </Button>
                        </div>

                        {/* CFX Toggle Icon */}
                        <div className="flex flex-col items-center space-y-2 w-full">
                            <div className="w-8 h-px bg-gray-700/50 my-1" />
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-lg relative",
                                    includeCFX && "bg-[#5865F2]/20 text-[#5865F2]"
                                )}
                                onClick={onToggleCFX}
                            >
                                {includeCFX ? (
                                    <ToggleRight className="h-5 w-5 text-[#5865F2]" />
                                ) : (
                                    <ToggleLeft className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <ScrollArea className="flex-1">
                        <div className="space-y-5 p-4">
                            {/* Search box with icon - updated to use real-time search */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-2"
                            >
                                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">Search</h4>
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={handleSearchInputChange}
                                        placeholder="Search natives..."
                                        className="w-full rounded-xl border border-[#5865F2]/10 bg-[#0F0B2B]/40 pl-9 pr-10 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 focus:border-transparent transition-all duration-200"
                                    />
                                    <Button
                                        type="submit"
                                        className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2]/40 transition-colors"
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <ChevronRight className="h-4 w-4 text-[#5865F2]" />
                                    </Button>
                                </form>
                            </motion.div>

                            {/* Game selection updated with larger icons */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="space-y-2"
                            >
                                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">Game</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={game === 'gta5' ? 'default' : 'outline'}
                                        className={cn(
                                            "py-4 rounded-xl transition-all duration-200",
                                            game === 'gta5' 
                                                ? "bg-gradient-to-br from-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:to-[#3C45A5] text-white border-none shadow-lg shadow-[#5865F2]/20" 
                                                : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                        )}
                                        onClick={() => onGameChange('gta5')}
                                    >
                                        <Gamepad2 className="h-4 w-4 mr-2" />
                                        GTA V
                                    </Button>
                                    <Button
                                        variant={game === 'rdr3' ? 'default' : 'outline'}
                                        className={cn(
                                            "py-4 rounded-xl transition-all duration-200",
                                            game === 'rdr3' 
                                                ? "bg-gradient-to-br from-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:to-[#3C45A5] text-white border-none shadow-lg shadow-[#5865F2]/20" 
                                                : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                        )}
                                        onClick={() => onGameChange('rdr3')}
                                    >
                                        <Gamepad2 className="h-4 w-4 mr-2" />
                                        RDR3
                                    </Button>
                                </div>
                            </motion.div>

                            {/* CFX inclusion toggle - improved styling */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-2"
                            >
                                <div className="bg-gradient-to-br from-[#0F0B2B]/80 to-[#0F0B2B]/40 rounded-xl p-4 border border-[#5865F2]/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-[#5865F2]" />
                                            <Label htmlFor="cfx-toggle" className="text-sm font-medium text-white">
                                                CFX Natives
                                            </Label>
                                        </div>
                                        <Switch
                                            id="cfx-toggle"
                                            checked={includeCFX}
                                            onCheckedChange={onToggleCFX}
                                            className="data-[state=checked]:bg-[#5865F2] data-[state=unchecked]:bg-gray-600"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        CitizenFX framework functions for client and server scripting.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Environment selection with larger icons */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="space-y-2"
                            >
                                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">Environment</h4>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <Button
                                        variant={environment === 'all' ? 'default' : 'outline'}
                                        size="sm"
                                        className={cn(
                                            "py-3 rounded-lg transition-all duration-200",
                                            environment === 'all' 
                                                ? "bg-gradient-to-br from-[#5865F2] to-[#4752C4] text-white border-none shadow-md shadow-[#5865F2]/20" 
                                                : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                        )}
                                        onClick={() => onEnvironmentChange('all')}
                                    >
                                        <Layers className="h-3.5 w-3.5 mr-1" />
                                        All
                                    </Button>
                                    <Button
                                        variant={environment === 'client' ? 'default' : 'outline'}
                                        size="sm"
                                        className={cn(
                                            "py-3 rounded-lg transition-all duration-200",
                                            environment === 'client' 
                                                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-md shadow-blue-500/20" 
                                                : "border-[#5865F2]/10 hover:border-blue-500/30 hover:bg-blue-500/5"
                                        )}
                                        onClick={() => onEnvironmentChange('client')}
                                    >
                                        <Monitor className="h-3.5 w-3.5 mr-1" />
                                        Client
                                    </Button>
                                    <Button
                                        variant={environment === 'server' ? 'default' : 'outline'}
                                        size="sm"
                                        className={cn(
                                            "py-3 rounded-lg transition-all duration-200",
                                            environment === 'server' 
                                                ? "bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-md shadow-green-500/20" 
                                                : "border-[#5865F2]/10 hover:border-green-500/30 hover:bg-green-500/5"
                                        )}
                                        onClick={() => onEnvironmentChange('server')}
                                    >
                                        <Server className="h-3.5 w-3.5 mr-1" />
                                        Server
                                    </Button>
                                </div>

                                {!includeCFX && environment === 'server' && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg"
                                    >
                                        <p className="text-xs text-amber-400">
                                            Enable CFX natives to see server-side functions.
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Categories - with improved organization */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">Categories</h4>
                                <div className="space-y-1.5 max-h-[calc(100vh-32rem)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#5865F2]/20 scrollbar-track-transparent">
                                    <Button
                                        variant={category === '' ? 'default' : 'outline'}
                                        className={cn(
                                            "w-full justify-start rounded-lg transition-all duration-200",
                                            category === '' 
                                                ? "bg-gradient-to-r from-[#5865F2] to-[#4752C4] text-white border-none shadow-md shadow-[#5865F2]/20" 
                                                : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                        )}
                                        onClick={() => onCategoryChange('')}
                                    >
                                        <Layers className="mr-2 h-4 w-4" />
                                        All Categories
                                    </Button>

                                    {/* CFX Framework at the top if available */}
                                    {cfxCategory.length > 0 && (
                                        <div className="mt-3 space-y-1.5">
                                            <h5 className="text-[10px] uppercase tracking-widest text-[#5865F2]/70 px-1 flex items-center gap-1.5">
                                                <Sparkles className="h-3 w-3" />
                                                CitizenFX Framework
                                            </h5>
                                            {cfxCategory.map(cat => (
                                                <Button
                                                    key={cat}
                                                    variant={category === cat ? 'default' : 'outline'}
                                                    size="sm"
                                                    className={cn(
                                                        "w-full justify-start rounded-lg transition-all duration-200",
                                                        category === cat 
                                                            ? "bg-gradient-to-r from-[#5865F2] to-[#4752C4] text-white border-none shadow-sm shadow-[#5865F2]/20" 
                                                            : "border-[#5865F2]/10 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5"
                                                    )}
                                                    onClick={() => onCategoryChange(cat)}
                                                >
                                                    <Sparkles className="mr-2 h-3.5 w-3.5 text-[#5865F2]" />
                                                    CFX Framework
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Server Categories */}
                                    {sortedServerCategories.length > 0 && environment !== 'client' && (
                                        <div className="mt-3 space-y-1.5">
                                            <h5 className="text-[10px] uppercase tracking-widest text-green-400/70 px-1 flex items-center gap-1.5">
                                                <Server className="h-3 w-3" />
                                                Server Categories
                                            </h5>
                                            <div className="space-y-0.5">
                                                {sortedServerCategories.map(cat => (
                                                    <Button
                                                        key={cat}
                                                        variant={category === cat ? 'default' : 'ghost'}
                                                        size="sm"
                                                        className={cn(
                                                            "w-full justify-start h-auto py-2 rounded-lg transition-all duration-200",
                                                            category === cat 
                                                                ? "bg-gradient-to-r from-green-500/90 to-green-600/90 text-white shadow-sm shadow-green-500/20" 
                                                                : "hover:bg-green-500/10 text-muted-foreground hover:text-white"
                                                        )}
                                                        onClick={() => onCategoryChange(cat)}
                                                    >
                                                        <Server className="mr-2 h-3 w-3 text-green-400 shrink-0" />
                                                        <span className="truncate text-xs">{cat}</span>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Client Categories */}
                                    {sortedClientCategories.length > 0 && environment !== 'server' && (
                                        <div className="mt-3 space-y-1.5">
                                            <h5 className="text-[10px] uppercase tracking-widest text-blue-400/70 px-1 flex items-center gap-1.5">
                                                <Monitor className="h-3 w-3" />
                                                Client Categories
                                            </h5>
                                            <div className="space-y-0.5">
                                                {sortedClientCategories.map(cat => (
                                                    <Button
                                                        key={cat}
                                                        variant={category === cat ? 'default' : 'ghost'}
                                                        size="sm"
                                                        className={cn(
                                                            "w-full justify-start h-auto py-2 rounded-lg transition-all duration-200",
                                                            category === cat 
                                                                ? "bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white shadow-sm shadow-blue-500/20" 
                                                                : "hover:bg-blue-500/10 text-muted-foreground hover:text-white"
                                                        )}
                                                        onClick={() => onCategoryChange(cat)}
                                                    >
                                                        <Monitor className="mr-2 h-3 w-3 text-blue-400 shrink-0" />
                                                        <span className="truncate text-xs">{cat}</span>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </ScrollArea>
                )}

                {/* Information Footer with updated content */}
                {!isCollapsed && (
                    <div className="border-t border-[#5865F2]/10">
                        <Button
                            variant="ghost"
                            className="w-full justify-between px-4 py-3 hover:bg-[#5865F2]/10 rounded-none"
                            onClick={() => setIsInfoOpen(!isInfoOpen)}
                        >
                            <div className="flex items-center gap-2">
                                <InfoIcon className="h-4 w-4 text-[#5865F2]" />
                                <span className="text-sm text-white">Info & Navigation</span>
                            </div>
                            <motion.div
                                animate={{ rotate: isInfoOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronUp className="h-4 w-4 text-[#5865F2]" />
                            </motion.div>
                        </Button>
                        <AnimatePresence>
                            {isInfoOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 space-y-4 bg-gradient-to-b from-[#0F0B2B]/80 to-[#0F0B2B]/40">
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium text-white">About Natives</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                Natives are low-level functions provided by the CitizenFX framework and game engines.
                                            </p>
                                            <div className="space-y-2">
                                                <h5 className="text-xs font-medium text-muted-foreground">Environment Types:</h5>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                        <span><strong className="text-white">Client</strong> - Player's computer</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                        <span><strong className="text-white">Server</strong> - Game server</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                                        <span><strong className="text-white">Shared</strong> - Both environments</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Navigation Links */}
                                        <div className="pt-3 border-t border-[#5865F2]/10 space-y-3">
                                            <h4 className="text-sm font-medium text-white">Quick Links</h4>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {NAV_LINKS.map((item) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <Button
                                                            key={item.href}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="justify-start h-8 px-2 hover:bg-[#5865F2]/10"
                                                            asChild
                                                        >
                                                            {item.external ? (
                                                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                                    <Icon className="h-3 w-3 mr-1.5 text-[#5865F2]" />
                                                                    <span className="text-xs">{item.name}</span>
                                                                </a>
                                                            ) : (
                                                                <Link href={item.href} className="flex items-center">
                                                                    <Icon className="h-3 w-3 mr-1.5 text-[#5865F2]" />
                                                                    <span className="text-xs">{item.name}</span>
                                                                </Link>
                                                            )}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
