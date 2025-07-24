"use client"

import * as React from "react"
import { cn } from "@utils/functions/cn"
import { Button } from "@ui/components/button"
import { ScrollArea } from "@ui/components/scroll-area"
import { Settings, ChevronLeft, ChevronRight, Code, Gamepad2, Monitor, Server, ChevronUp, ChevronDown, ToggleRight, ToggleLeft, Search, Home, InfoIcon } from "lucide-react"
import Link from "next/link"
import { useState, useCallback, useRef, useEffect } from "react"
import { NAV_LINKS } from "@utils/constants/link"
import { Switch } from "@ui/components/switch"
import { Label } from "@ui/components/label"

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
            <div className={cn(
                'flex flex-col h-full bg-fd-background backdrop-blur-sm border-r border-[#5865F2]/20 shadow-lg transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-72'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#5865F2]/20">
                    {!isCollapsed && (
                        <Link href="/" className="flex items-center gap-2">
                            <Code className="h-5 w-5 text-[#5865F2]" />
                            <span className="font-semibold text-white">Natives</span>
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
                        <div className="space-y-4 p-4">
                            {/* Search box with icon - updated to use real-time search */}
                            <div className="space-y-2 pt-2">
                                <h4 className="text-sm font-medium text-muted-foreground px-2">Search</h4>
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={handleSearchInputChange}
                                        placeholder="Search natives..."
                                        className="w-full rounded-md border border-[#5865F2]/20 bg-fd-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2"
                                    />
                                    <Button
                                        type="submit"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 rounded-sm bg-[#5865F2]/10 hover:bg-[#5865F2]/20"
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <ChevronRight className="h-4 w-4 text-[#5865F2]" />
                                    </Button>
                                </form>
                            </div>

                            {/* Game selection updated with larger icons */}
                            <div className="space-y-2 pt-4">
                                <h4 className="text-sm font-medium text-muted-foreground px-2">Game</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={game === 'gta5' ? 'default' : 'outline'}
                                        className={cn(
                                            "py-5",
                                            game === 'gta5' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                                        )}
                                        onClick={() => onGameChange('gta5')}
                                    >
                                        <Gamepad2 className="h-5 w-5 mr-2" />
                                        GTA V
                                    </Button>
                                    <Button
                                        variant={game === 'rdr3' ? 'default' : 'outline'}
                                        className={cn(
                                            "py-5",
                                            game === 'rdr3' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                                        )}
                                        onClick={() => onGameChange('rdr3')}
                                    >
                                        <Gamepad2 className="h-5 w-5 mr-2" />
                                        RDR3
                                    </Button>
                                </div>
                            </div>

                            {/* CFX inclusion toggle - improved styling */}
                            <div className="space-y-2 pt-4">
                                <div className="bg-[#0F0B2B]/50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <Label htmlFor="cfx-toggle" className="text-sm font-medium text-white">
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
                                    <p className="text-xs text-muted-foreground">
                                        CFX natives provide CitizenFX framework functionality for both client and server scripting.
                                    </p>
                                </div>
                            </div>

                            {/* Environment selection with larger icons */}
                            <div className="space-y-2 pt-4">
                                <h4 className="text-sm font-medium text-muted-foreground px-2">Environment</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant={environment === 'all' ? 'default' : 'outline'}
                                        className={cn(
                                            "py-5",
                                            environment === 'all' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                                        )}
                                        onClick={() => onEnvironmentChange('all')}
                                    >
                                        <Code className="h-5 w-5 mr-1" />
                                        All
                                    </Button>
                                    <Button
                                        variant={environment === 'client' ? 'default' : 'outline'}
                                        className={cn(
                                            "py-5",
                                            environment === 'client' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                                        )}
                                        onClick={() => onEnvironmentChange('client')}
                                    >
                                        <Monitor className="h-5 w-5 mr-1" />
                                        Client
                                    </Button>
                                    <Button
                                        variant={environment === 'server' ? 'default' : 'outline'}
                                        className={cn(
                                            "py-5",
                                            environment === 'server' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                                        )}
                                        onClick={() => onEnvironmentChange('server')}
                                    >
                                        <Server className="h-5 w-5 mr-1" />
                                        Server
                                    </Button>
                                </div>

                                <div className="mt-2 bg-[#0F0B2B]/30 p-3 rounded-lg">
                                    <p className="text-xs text-muted-foreground">
                                        <strong className="text-white">Server natives</strong> are primarily found in the <strong className="text-[#5865F2]">CFX</strong> namespace.
                                        {!includeCFX && (
                                            <span className="mt-1 block text-amber-400">
                                                Enable CFX natives to see server-side functions.
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Categories - with improved organization */}
                            <div className="space-y-2 pt-4">
                                <h4 className="text-sm font-medium text-muted-foreground px-2">Categories</h4>
                                <div className="space-y-2 max-h-[calc(100vh-26rem)] overflow-y-auto pr-2">
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

                                    {/* CFX Framework at the top if available */}
                                    {cfxCategory.length > 0 && (
                                        <div className="mt-3 space-y-1.5">
                                            <h5 className="text-xs uppercase tracking-wider text-muted-foreground px-2">
                                                CitizenFX Framework
                                            </h5>
                                            {cfxCategory.map(cat => (
                                                <Button
                                                    key={cat}
                                                    variant={category === cat ? 'default' : 'outline'}
                                                    className={cn(
                                                        "w-full justify-start",
                                                        category === cat && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-sm shadow-[#5865F2]/20"
                                                    )}
                                                    onClick={() => onCategoryChange(cat)}
                                                >
                                                    <Code className="mr-2 h-4 w-4 text-[#5865F2]" />
                                                    CFX Framework
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Server Categories */}
                                    {sortedServerCategories.length > 0 && environment !== 'client' && (
                                        <div className="mt-3 space-y-1.5">
                                            <h5 className="text-xs uppercase tracking-wider text-muted-foreground px-2 flex items-center gap-1.5">
                                                <Server className="h-3 w-3 text-green-400" />
                                                Server Categories
                                            </h5>
                                            <div className="space-y-1">
                                                {sortedServerCategories.map(cat => (
                                                    <Button
                                                        key={cat}
                                                        variant={category === cat ? 'default' : 'outline'}
                                                        size="sm"
                                                        className={cn(
                                                            "w-full justify-start h-auto py-2.5",
                                                            category === cat && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-sm shadow-[#5865F2]/20"
                                                        )}
                                                        onClick={() => onCategoryChange(cat)}
                                                    >
                                                        <Server className="mr-2 h-3.5 w-3.5 text-green-400 shrink-0" />
                                                        <span className="truncate">{cat}</span>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Client Categories */}
                                    {sortedClientCategories.length > 0 && environment !== 'server' && (
                                        <div className="mt-3 space-y-1.5">
                                            <h5 className="text-xs uppercase tracking-wider text-muted-foreground px-2 flex items-center gap-1.5">
                                                <Monitor className="h-3 w-3 text-blue-400" />
                                                Client Categories
                                            </h5>
                                            <div className="space-y-1">
                                                {sortedClientCategories.map(cat => (
                                                    <Button
                                                        key={cat}
                                                        variant={category === cat ? 'default' : 'outline'}
                                                        size="sm"
                                                        className={cn(
                                                            "w-full justify-start h-auto py-2.5",
                                                            category === cat && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none shadow-sm shadow-[#5865F2]/20"
                                                        )}
                                                        onClick={() => onCategoryChange(cat)}
                                                    >
                                                        <Monitor className="mr-2 h-3.5 w-3.5 text-blue-400 shrink-0" />
                                                        <span className="truncate">{cat}</span>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                )}

                {/* Information Footer with updated content */}
                {!isCollapsed && (
                    <div className="border-t border-[#5865F2]/20">
                        <Button
                            variant="ghost"
                            className="w-full justify-between px-4 py-3 hover:bg-[#5865F2]/20"
                            onClick={() => setIsInfoOpen(!isInfoOpen)}
                        >
                            <div className="flex items-center gap-2">
                                <InfoIcon className="h-4 w-4 text-[#5865F2]" />
                                <span className="text-white">Info and Extras</span>
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
                                    <h4 className="text-sm font-medium text-white">About Natives</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Natives are low-level functions provided by the CitizenFX framework and the underlying game engines.
                                    </p>
                                    <div>
                                        <h5 className="text-xs font-medium text-muted-foreground mb-1">Environment Types:</h5>
                                        <ul className="text-xs space-y-1.5 text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <div className="h-3.5 w-3.5 rounded-full bg-blue-500 mt-0.5"></div>
                                                <span><strong className="text-white">Client</strong> - Runs on player's computer</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="h-3.5 w-3.5 rounded-full bg-green-500 mt-0.5"></div>
                                                <span><strong className="text-white">Server</strong> - Runs on the game server</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="h-3.5 w-3.5 rounded-full bg-purple-500 mt-0.5"></div>
                                                <span><strong className="text-white">Shared</strong> - Works on both environments</span>
                                            </li>
                                        </ul>
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
            </div>
        </div>
    );
}
