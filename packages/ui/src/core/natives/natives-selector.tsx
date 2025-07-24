"use client"

import { Button } from "@ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@ui/components/sheet";
import { ChevronDown, Gamepad2, Monitor, Server, Code, Filter, ToggleRight, ToggleLeft } from "lucide-react";
import { cn } from "@utils/functions/cn";

interface GameSelectorProps {
    game: 'gta5' | 'rdr3'; // Remove CFX as game option
    onGameChange: (game: 'gta5' | 'rdr3') => void;
}

export function GameSelector({ game, onGameChange }: GameSelectorProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-fd-background/50 border-[#5865F2]/20 h-8 gap-1"
                >
                    <Gamepad2 className="h-4 w-4 text-[#5865F2]" />
                    {game === 'gta5' ? 'GTA V' : 'RDR3'}
                    <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0 bg-fd-background border-[#5865F2]/20">
                <div className="p-1 grid grid-cols-1 gap-1">
                    <Button
                        variant={game === 'gta5' ? 'default' : 'ghost'}
                        size="sm"
                        className={cn(
                            "justify-start",
                            game === 'gta5' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                        )}
                        onClick={() => onGameChange('gta5')}
                    >
                        <Gamepad2 className="mr-2 h-4 w-4" />
                        GTA V
                    </Button>
                    <Button
                        variant={game === 'rdr3' ? 'default' : 'ghost'}
                        size="sm"
                        className={cn(
                            "justify-start",
                            game === 'rdr3' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                        )}
                        onClick={() => onGameChange('rdr3')}
                    >
                        <Gamepad2 className="mr-2 h-4 w-4" />
                        RDR3
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

interface EnvironmentSelectorProps {
    environment: 'all' | 'client' | 'server';
    onEnvironmentChange: (environment: 'all' | 'client' | 'server') => void;
}

export function EnvironmentSelector({ environment, onEnvironmentChange }: EnvironmentSelectorProps) {
    const icons = {
        all: <Server className="h-4 w-4 text-[#5865F2]" />,
        client: <Monitor className="h-4 w-4 text-[#5865F2]" />,
        server: <Server className="h-4 w-4 text-[#5865F2]" />
    };

    const labels = {
        all: 'All',
        client: 'Client',
        server: 'Server'
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-fd-background/50 border-[#5865F2]/20 h-8 gap-1"
                >
                    {icons[environment]}
                    {labels[environment]}
                    <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0 bg-fd-background border-[#5865F2]/20">
                <div className="p-1 grid grid-cols-1 gap-1">
                    <Button
                        variant={environment === 'all' ? 'default' : 'ghost'}
                        size="sm"
                        className={cn(
                            "justify-start",
                            environment === 'all' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                        )}
                        onClick={() => onEnvironmentChange('all')}
                    >
                        <Server className="mr-2 h-4 w-4" />
                        All
                    </Button>
                    <Button
                        variant={environment === 'client' ? 'default' : 'ghost'}
                        size="sm"
                        className={cn(
                            "justify-start",
                            environment === 'client' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                        )}
                        onClick={() => onEnvironmentChange('client')}
                    >
                        <Monitor className="mr-2 h-4 w-4" />
                        Client
                    </Button>
                    <Button
                        variant={environment === 'server' ? 'default' : 'ghost'}
                        size="sm"
                        className={cn(
                            "justify-start",
                            environment === 'server' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                        )}
                        onClick={() => onEnvironmentChange('server')}
                    >
                        <Server className="mr-2 h-4 w-4" />
                        Server
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

interface CFXToggleProps {
    includeCFX: boolean;
    onToggle: () => void;
}

export function CFXToggle({ includeCFX, onToggle }: CFXToggleProps) {
    return (
        <Button
            variant="outline"
            size="sm"
            className="bg-fd-background/50 border-[#5865F2]/20 h-8 gap-1"
            onClick={onToggle}
        >
            <Code className="h-4 w-4 text-[#5865F2]" />
            {includeCFX ? (
                <>
                    CFX: On <ToggleRight className="h-3.5 w-3.5 ml-1 text-[#5865F2]" />
                </>
            ) : (
                <>
                    CFX: Off <ToggleLeft className="h-3.5 w-3.5 ml-1 opacity-70" />
                </>
            )}
        </Button>
    );
}

interface CategorySheetProps {
    categories: string[];
    categoriesByGameAndEnv?: Record<string, Record<string, string[]>> | null;
    category: string;
    onCategoryChange: (category: string) => void;
    game: 'gta5' | 'rdr3'; // Remove CFX from game type
    environment: 'all' | 'client' | 'server';
}

export function CategorySheet({
    categories,
    categoriesByGameAndEnv = null,
    category,
    onCategoryChange,
    game,
    environment
}: CategorySheetProps) {
    // Get the appropriate categories based on current game and environment
    const getRelevantCategories = () => {
        if (categoriesByGameAndEnv && categoriesByGameAndEnv[game] && categoriesByGameAndEnv[game][environment]) {
            return categoriesByGameAndEnv[game][environment];
        }
        return categories; // Fallback to the old categories array
    };

    const relevantCategories = getRelevantCategories();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-fd-background/50 border-[#5865F2]/20 h-8 gap-1"
                >
                    <Filter className="h-3.5 w-3.5 text-[#5865F2]" />
                    Category
                    <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] px-0">
                <SheetHeader className="px-4 pb-4 border-b border-[#5865F2]/20">
                    <SheetTitle>Select Category</SheetTitle>
                </SheetHeader>
                <div className="p-4 overflow-auto max-h-[calc(70vh-80px)]">
                    <div className="grid grid-cols-1 gap-2">
                        <Button
                            variant={category === '' ? 'default' : 'outline'}
                            className={cn(
                                "justify-start",
                                category === '' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                            )}
                            onClick={() => onCategoryChange('')}
                        >
                            <Code className="mr-2 h-4 w-4" />
                            All Categories
                        </Button>
                        {relevantCategories.map((cat) => (
                            <Button
                                key={cat}
                                variant={category === cat ? 'default' : 'outline'}
                                className={cn(
                                    "justify-start",
                                    category === cat && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                                )}
                                onClick={() => onCategoryChange(cat)}
                            >
                                <Code className="mr-2 h-4 w-4" />
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
