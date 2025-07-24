"use client";

import * as React from "react";
import { useCallback, useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/packages/ui/src/components/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/packages/ui/src/components/tabs";
import { Badge } from "@/packages/ui/src/components/badge";
import { Button } from "@/packages/ui/src/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/packages/ui/src/components/card";
import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/src/components/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/packages/ui/src/components/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/packages/ui/src/components/dropdown-menu";
import { Progress } from "@/packages/ui/src/components/progress";
import { Input } from "@/packages/ui/src/components/input";
import { Separator } from "@/packages/ui/src/components/separator";
import { Sheet, SheetContent, SheetClose, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/packages/ui/src/components/sheet";
import { cn } from "@/packages/utils/src/functions/cn";
import { formatDistanceToNow } from "date-fns";
import {
    Search,
    Server,
    ServerCrash,
    Filter,
    X,
    AlertCircle,
    Copy,
    Download,
    ExternalLink,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

// Types
interface Artifact {
    version: string;
    recommended: boolean;
    critical: boolean;
    download_urls: {
        zip: string;
        "7z": string;
    };
    artifact_url: string;
    published_at: string;
    eol: boolean;
    supportStatus: "recommended" | "latest" | "active" | "deprecated" | "eol" | "unknown";
    supportEnds: string;
}

interface ArtifactsResponse {
    data: {
        windows?: Record<string, Artifact>;
        linux?: Record<string, Artifact>;
    };
    metadata: {
        platforms: string[];
        recommended: Record<string, Artifact & { version: string }>;
        latest: Record<string, Artifact & { version: string }>;
        stats: Record<string, {
            total: number;
            filtered: number;
            recommended: number;
            latest: number;
            active: number;
            deprecated: number;
            eol: number;
        }>;
        pagination: {
            limit: number;
            offset: number;
            filtered: number;
            total: number;
            currentPage: number;
            totalPages: number;
        };
        filters: {
            search?: string;
            platform?: string;
            supportStatus?: string;
            includeEol: boolean;
            beforeDate?: string;
            afterDate?: string;
            sortBy: string;
            sortOrder: string;
        };
        supportSchedule: {
            recommended: string;
            latest: string;
            eol: string;
        };
        supportStatusExplanation: {
            recommended: string;
            latest: string;
            active: string;
            deprecated: string;
            eol: string;
            info: string;
        };
    };
}

interface ArtifactsContentProps {
    platform: "windows" | "linux";
    searchQuery?: string;
    sortBy?: "version" | "date";
    sortOrder?: "asc" | "desc";
    status?: "recommended" | "latest" | "active" | "deprecated" | "eol";
    includeEol?: boolean;
}

export function ArtifactsContent({ platform, searchQuery = "", sortBy = "version", sortOrder = "desc", status, includeEol = false }: ArtifactsContentProps) {
    const [artifacts, setArtifacts] = useState<ArtifactsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState(searchQuery);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTab, setSelectedTab] = useState<string>(platform);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [includeEolState, setIncludeEolState] = useState(includeEol);
    const [supportStatusFilter, setSupportStatusFilter] = useState<string | undefined>(status);
    const [sortingOptions, setSortingOptions] = useState({
        sortBy: sortBy,
        sortOrder: sortOrder
    });

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchArtifacts = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const limit = 10;
            const offset = (page - 1) * limit;

            // Construct query parameters
            const params = new URLSearchParams();
            params.set('platform', platform);
            if (search) params.set('search', search);
            if (supportStatusFilter) params.set('status', supportStatusFilter);
            if (includeEolState) params.set('includeEol', 'true');
            params.set('sortBy', sortingOptions.sortBy);
            params.set('sortOrder', sortingOptions.sortOrder);
            params.set('limit', limit.toString());
            params.set('offset', offset.toString());

            console.log("Fetching artifacts with params:", params.toString());
            const response = await fetch(`/api/artifacts/fetch?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Error fetching artifacts: ${response.status}`);
            }

            const data = await response.json();
            console.log("API response:", data);

            // Set the artifacts directly from the API response
            setArtifacts(data);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching artifacts:", err);
            setError("Failed to load artifacts. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [platform, search, supportStatusFilter, includeEolState, sortingOptions]);

    const clearAllFilters = useCallback(() => {
        setSearch("");
        setSupportStatusFilter(undefined);
        setIncludeEolState(false);
        setSortingOptions({ sortBy: "version", sortOrder: "desc" });
    }, []);

    useEffect(() => {
        setSelectedTab(platform);
        fetchArtifacts(1);
    }, [platform, fetchArtifacts]);

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            fetchArtifacts(1);
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [search, fetchArtifacts]);

    useEffect(() => {
        fetchArtifacts(1);
    }, [includeEolState, supportStatusFilter, sortingOptions, fetchArtifacts]);

    useEffect(() => {
        fetchArtifacts(1);
    }, [sortingOptions, fetchArtifacts]);

    const handleTabChange = (value: string) => {
        setSelectedTab(value as "windows" | "linux");
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchArtifacts(page);
        containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const applyFilters = () => {
        fetchArtifacts(1);
        setIsFilterOpen(false);
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'recommended':
                return 'bg-green-500/20 text-green-500 border-green-500/50';
            case 'latest':
                return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
            case 'active':
                return 'bg-cyan-500/20 text-cyan-500 border-cyan-500/50';
            case 'deprecated':
                return 'bg-amber-500/20 text-amber-500 border-amber-500/50';
            case 'eol':
                return 'bg-red-500/20 text-red-500 border-red-500/50';
            default:
                return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
        }
    };

    const getStatusBgColor = (status: string): string => {
        switch (status) {
            case 'recommended':
                return 'bg-gradient-to-r from-green-800/5 to-green-700/10';
            case 'latest':
                return 'bg-gradient-to-r from-blue-800/5 to-blue-700/10';
            case 'active':
                return 'bg-gradient-to-r from-cyan-800/5 to-cyan-700/10';
            case 'deprecated':
                return 'bg-gradient-to-r from-amber-800/5 to-amber-700/10';
            case 'eol':
                return 'bg-gradient-to-r from-red-800/5 to-red-700/10';
            default:
                return 'bg-gradient-to-r from-gray-800/5 to-gray-700/10';
        }
    };

    const formatDate = (dateString: string): string => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (e) {
            return "Unknown date";
        }
    };

    const handleDownload = (url: string) => {
        window.open(url, "_blank");
    };

    const handleCopyVersion = (version: string) => {
        navigator.clipboard.writeText(version);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Mobile search and filter bar */}
            <div className="flex items-center justify-between gap-2 p-3 md:hidden sticky top-0 bg-fd-background/95 backdrop-blur-md z-10 border-b border-[#5865F2]/20">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search artifacts..."
                        value={search}
                        onChange={handleSearchChange}
                        className={cn("pl-8 bg-fd-background/50", search && "pr-8")}
                    />
                    {search && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSearch("")}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                </div>
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80%] bg-fd-background/80">
                        <div className="absolute top-0 inset-x-0 flex flex-col items-center">
                            <div className="w-12 h-1 rounded-full bg-[#5865F2]/50 my-2" />
                            <div className="w-full border-b border-[#5865F2]/20" />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-3 h-8 w-8 rounded-full"
                            onClick={() => setIsFilterOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        <SheetHeader className="pt-6">
                            <div className="flex justify-between items-center">
                                <SheetTitle>Filter Artifacts</SheetTitle>
                            </div>
                            <SheetDescription>
                                Customize your view of server artifacts
                            </SheetDescription>
                        </SheetHeader>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Status</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {["recommended", "latest", "active", "deprecated", "eol"].map((statusOption) => (
                                        <Button
                                            key={statusOption}
                                            variant={supportStatusFilter === statusOption ? "default" : "outline"}
                                            className={cn(
                                                supportStatusFilter === statusOption && "bg-[#5865F2]"
                                            )}
                                            onClick={() => setSupportStatusFilter(supportStatusFilter === statusOption ? undefined : statusOption)}
                                        >
                                            {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                                        </Button>
                                    ))}
                                    <Button
                                        variant={!supportStatusFilter ? "default" : "outline"}
                                        className={cn(
                                            !supportStatusFilter && "bg-[#5865F2]"
                                        )}
                                        onClick={() => setSupportStatusFilter(undefined)}
                                    >
                                        All Statuses
                                    </Button>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Sort By</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={sortingOptions.sortBy === "version" ? "default" : "outline"}
                                        className={cn(
                                            sortingOptions.sortBy === "version" && "bg-[#5865F2]"
                                        )}
                                        onClick={() => setSortingOptions({ ...sortingOptions, sortBy: "version" })}
                                    >
                                        Version Number
                                    </Button>
                                    <Button
                                        variant={sortingOptions.sortBy === "date" ? "default" : "outline"}
                                        className={cn(
                                            sortingOptions.sortBy === "date" && "bg-[#5865F2]"
                                        )}
                                        onClick={() => setSortingOptions({ ...sortingOptions, sortBy: "date" })}
                                    >
                                        Release Date
                                    </Button>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Sort Order</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={sortingOptions.sortOrder === "desc" ? "default" : "outline"}
                                        className={cn(
                                            sortingOptions.sortOrder === "desc" && "bg-[#5865F2]"
                                        )}
                                        onClick={() => setSortingOptions({ ...sortingOptions, sortOrder: "desc" })}
                                    >
                                        Newest First
                                    </Button>
                                    <Button
                                        variant={sortingOptions.sortOrder === "asc" ? "default" : "outline"}
                                        className={cn(
                                            sortingOptions.sortOrder === "asc" && "bg-[#5865F2]"
                                        )}
                                        onClick={() => setSortingOptions({ ...sortingOptions, sortOrder: "asc" })}
                                    >
                                        Oldest First
                                    </Button>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Include EOL Artifacts</span>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant={includeEolState ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setIncludeEolState(!includeEolState)}
                                        className={cn(
                                            includeEolState ? "bg-[#5865F2]" : ""
                                        )}
                                    >
                                        {includeEolState ? "Yes" : "No"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <SheetFooter>
                            <div className="flex w-full gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={clearAllFilters}
                                >
                                    Reset
                                </Button>
                                <Button
                                    onClick={applyFilters}
                                    className="flex-1 bg-[#5865F2] hover:bg-[#5865F2]/90"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-hidden" ref={containerRef}>
                <Tabs
                    value={selectedTab}
                    onValueChange={handleTabChange}
                    className="h-full flex flex-col"
                >
                    <div className="border-b border-[#5865F2]/20 px-4 pt-4 pb-0 bg-fd-background/80 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                            {/* Replace TabsList with platform title and info */}
                            <div className="flex items-center gap-2">
                                <div className="bg-[#5865F2]/20 p-1.5 rounded-md">
                                    {selectedTab === "windows" ? (
                                        <Server className="h-5 w-5 text-[#5865F2]" />
                                    ) : (
                                        <ServerCrash className="h-5 w-5 text-[#5865F2]" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        {selectedTab === "windows" ? "Windows" : "Linux"} Artifacts
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedTab === "windows" ?
                                            "FiveM and RedM server artifacts for Windows systems" :
                                            "FiveM and RedM server artifacts for Linux systems"}
                                    </p>
                                </div>
                            </div>

                            {/* Desktop search and filter */}
                            <div className="hidden md:flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search artifacts..."
                                        value={search}
                                        onChange={handleSearchChange}
                                        className={cn("pl-8 w-64 bg-fd-background/50 focus-visible:ring-[#5865F2]", search && "pr-8")}
                                    />
                                    {search && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSearch("")}
                                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                        >
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                            <Filter className="h-3.5 w-3.5 mr-1" />
                                            Filter
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 bg-fd-background/95 backdrop-blur-md p-2">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center px-1.5 py-1">
                                                <span className="text-xs text-white font-medium">Filters</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={clearAllFilters}
                                                    className="h-6 px-2 py-0 text-xs text-muted-foreground hover:text-white"
                                                >
                                                    Clear All
                                                </Button>
                                            </div>

                                            <Separator className="my-1" />

                                            <div className="space-y-1.5">
                                                <div className="text-xs font-medium text-white mb-1 px-1.5">Status</div>
                                                {["All", "Recommended", "Latest", "Active", "Deprecated", "EOL"].map((statusOption) => (
                                                    <DropdownMenuItem
                                                        key={statusOption}
                                                        className={cn(
                                                            "cursor-pointer rounded-md text-sm",
                                                            supportStatusFilter === statusOption.toLowerCase() && "bg-[#5865F2]/20 text-[#5865F2]"
                                                        )}
                                                        onClick={() => setSupportStatusFilter(
                                                            statusOption === "All"
                                                                ? undefined
                                                                : statusOption.toLowerCase() as any
                                                        )}
                                                    >
                                                        {statusOption}
                                                    </DropdownMenuItem>
                                                ))}
                                            </div>
                                            <Separator className="my-1" />
                                            <div className="space-y-1.5">
                                                <div className="text-xs font-medium text-white mb-1 px-1.5">Sort By</div>
                                                <DropdownMenuItem
                                                    className={cn(
                                                        "cursor-pointer rounded-md text-sm",
                                                        sortingOptions.sortBy === "version" && "bg-[#5865F2]/20 text-[#5865F2]"
                                                    )}
                                                    onClick={() => setSortingOptions({ ...sortingOptions, sortBy: "version" })}
                                                >
                                                    Version Number
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className={cn(
                                                        "cursor-pointer rounded-md text-sm",
                                                        sortingOptions.sortBy === "date" && "bg-[#5865F2]/20 text-[#5865F2]"
                                                    )}
                                                    onClick={() => setSortingOptions({ ...sortingOptions, sortBy: "date" })}
                                                >
                                                    Release Date
                                                </DropdownMenuItem>
                                            </div>
                                            <Separator className="my-1" />
                                            <div className="space-y-1.5">
                                                <div className="text-xs font-medium text-white mb-1 px-1.5">Sort Order</div>
                                                <DropdownMenuItem
                                                    className={cn(
                                                        "cursor-pointer rounded-md text-sm",
                                                        sortingOptions.sortOrder === "desc" && "bg-[#5865F2]/20 text-[#5865F2]"
                                                    )}
                                                    onClick={() => setSortingOptions({ ...sortingOptions, sortOrder: "desc" })}
                                                >
                                                    Newest First
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className={cn(
                                                        "cursor-pointer rounded-md text-sm",
                                                        sortingOptions.sortOrder === "asc" && "bg-[#5865F2]/20 text-[#5865F2]"
                                                    )}
                                                    onClick={() => setSortingOptions({ ...sortingOptions, sortOrder: "asc" })}
                                                >
                                                    Oldest First
                                                </DropdownMenuItem>
                                            </div>
                                            <Separator className="my-1" />
                                            <div className="flex items-center justify-between px-1.5 py-1">
                                                <span className="text-xs">Include EOL</span>
                                                <Button
                                                    size="sm"
                                                    variant={includeEolState ? "default" : "outline"}
                                                    className={cn(
                                                        "h-6 px-2 text-xs",
                                                        includeEolState && "bg-[#5865F2] hover:bg-[#5865F2]/90"
                                                    )}
                                                    onClick={() => setIncludeEolState(!includeEolState)}
                                                >
                                                    {includeEolState ? "Yes" : "No"}
                                                </Button>
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        {/* Hidden TabsList to maintain tab functionality without displaying it */}
                        <div className="sr-only">
                            <TabsList>
                                <TabsTrigger value="windows">Windows</TabsTrigger>
                                <TabsTrigger value="linux">Linux</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-4 mb-16">
                            {/* Rendering content for each platform */}
                            {["windows", "linux"].map((platformKey) => (
                                <TabsContent
                                    key={platformKey}
                                    value={platformKey}
                                    className="m-0 p-0"
                                >
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center p-12">
                                            <div className="w-full max-w-md space-y-4">
                                                <Progress value={undefined} className="w-full h-2" />
                                                <p className="text-center text-sm text-muted-foreground">Loading artifacts...</p>
                                                <Alert className="mt-4 bg-fd-background/30 border border-[#5865F2]/20">
                                                    <AlertCircle className="h-4 w-4 text-[#5865F2]" />
                                                    <AlertTitle className="text-[#5865F2]">Loading Artifacts</AlertTitle>
                                                    <AlertDescription className="text-sm text-muted-foreground">
                                                        <div className="space-y-2">
                                                            <p>We're fetching the latest server artifacts from the CFX Repository. This process involves:</p>
                                                            <div className="space-y-1.5">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-[#5865F2]/50 animate-pulse" />
                                                                    <span>Retrieving the latest build information</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-[#5865F2]/50 animate-pulse" />
                                                                    <span>Calculating support status for each version</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-[#5865F2]/50 animate-pulse" />
                                                                    <span>Determining recommended and latest builds</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-[#5865F2]/50 animate-pulse" />
                                                                    <span>Applying your selected filters and sorting</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground/80">This may take a few seconds as we ensure you get the most up-to-date information.</p>
                                                        </div>
                                                    </AlertDescription>
                                                </Alert>
                                            </div>
                                        </div>
                                    ) : error ? (
                                        <Alert className="mb-6">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Error</AlertTitle>
                                            <AlertDescription>
                                                {error}
                                            </AlertDescription>
                                        </Alert>
                                    ) : artifacts && artifacts.data[platformKey as keyof typeof artifacts.data] ? (
                                        <div className="space-y-6">
                                            {/* Recommended & Latest Artifacts */}
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {/* Recommended Artifact */}
                                                {artifacts.metadata.recommended[platformKey] && (
                                                    <Card className={cn(
                                                        "border border-green-500/30",
                                                        getStatusBgColor('recommended')
                                                    )}>
                                                        <CardHeader className="pb-2">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <CardTitle className="flex items-center gap-1.5">
                                                                        <span className="text-green-500">Recommended Artifact</span>
                                                                        <Badge
                                                                            className={getStatusColor('recommended')}
                                                                        >
                                                                            Recommended
                                                                        </Badge>
                                                                    </CardTitle>
                                                                    <CardDescription>Best choice for production use</CardDescription>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleCopyVersion(artifacts.metadata.recommended[platformKey].version)}
                                                                >
                                                                    <Copy className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <h3 className="text-2xl font-bold mb-2">
                                                                Version {artifacts.metadata.recommended[platformKey].version}
                                                            </h3>
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <span>Released {formatDate(artifacts.metadata.recommended[platformKey].published_at)}</span>
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={artifacts.metadata.recommended[platformKey].artifact_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center"
                                                                >
                                                                    <ExternalLink className="h-4 w-4 mr-1" />
                                                                    View Artifact
                                                                </a>
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700"
                                                                onClick={() => handleDownload(artifacts.metadata.recommended[platformKey].download_urls.zip)}
                                                            >
                                                                <Download className="h-4 w-4 mr-1" />
                                                                Download
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                )}

                                                {/* Latest Artifact */}
                                                {artifacts.metadata.latest[platformKey] && (
                                                    <Card className={cn(
                                                        "border border-blue-500/30",
                                                        getStatusBgColor('latest')
                                                    )}>
                                                        <CardHeader className="pb-2">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <CardTitle className="flex items-center gap-1.5">
                                                                        <span className="text-blue-500">Latest Artifact</span>
                                                                        <Badge
                                                                            className={getStatusColor('latest')}
                                                                        >
                                                                            Latest
                                                                        </Badge>
                                                                    </CardTitle>
                                                                    <CardDescription>Newest build for testing</CardDescription>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleCopyVersion(artifacts.metadata.latest[platformKey].version)}
                                                                >
                                                                    <Copy className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <h3 className="text-2xl font-bold mb-2">
                                                                Version {artifacts.metadata.latest[platformKey].version}
                                                            </h3>
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <span>Released {formatDate(artifacts.metadata.latest[platformKey].published_at)}</span>
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={artifacts.metadata.latest[platformKey].artifact_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center"
                                                                >
                                                                    <ExternalLink className="h-4 w-4 mr-1" />
                                                                    View Artifact
                                                                </a>
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="bg-blue-600 hover:bg-blue-700"
                                                                onClick={() => handleDownload(artifacts.metadata.latest[platformKey].download_urls.zip)}
                                                            >
                                                                <Download className="h-4 w-4 mr-1" />
                                                                Download
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                )}
                                            </div>

                                            {/* Stats and Filters */}
                                            <div className="bg-fd-background/30 rounded-lg border border-[#5865F2]/20 p-4">
                                                <h3 className="text-lg font-medium mb-2">Available Artifacts</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                                                    <div className="p-3 rounded-md bg-fd-background/50 border border-[#5865F2]/20 text-center">
                                                        <p className="text-xs text-muted-foreground">Total</p>
                                                        <p className="text-xl font-bold">{artifacts.metadata.stats[platformKey]?.total || 0}</p>
                                                    </div>
                                                    <div className="p-3 rounded-md bg-fd-background/50 border border-green-500/20 text-center">
                                                        <p className="text-xs text-muted-foreground">Recommended</p>
                                                        <p className="text-xl font-bold text-green-500">{artifacts.metadata.stats[platformKey]?.recommended || 0}</p>
                                                    </div>
                                                    <div className="p-3 rounded-md bg-fd-background/50 border border-blue-500/20 text-center">
                                                        <p className="text-xs text-muted-foreground">Latest</p>
                                                        <p className="text-xl font-bold text-blue-500">{artifacts.metadata.stats[platformKey]?.latest || 0}</p>
                                                    </div>
                                                    <div className="p-3 rounded-md bg-fd-background/50 border border-cyan-500/20 text-center">
                                                        <p className="text-xs text-muted-foreground">Active</p>
                                                        <p className="text-xl font-bold text-cyan-500">{artifacts.metadata.stats[platformKey]?.active || 0}</p>
                                                    </div>
                                                    <div className="p-3 rounded-md bg-fd-background/50 border border-red-500/20 text-center col-span-2 md:col-span-1">
                                                        <p className="text-xs text-muted-foreground">EOL</p>
                                                        <p className="text-xl font-bold text-red-500">{artifacts.metadata.stats[platformKey]?.eol || 0}</p>
                                                    </div>
                                                </div>

                                                {/* Active filters display */}
                                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                                    <span className="text-muted-foreground">Filters:</span>
                                                    {search && (
                                                        <Badge variant="outline" className="flex items-center gap-1 bg-fd-background/50">
                                                            Search: {search}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-4 w-4 ml-1 p-0"
                                                                onClick={() => setSearch("")}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </Badge>
                                                    )}
                                                    {supportStatusFilter && (
                                                        <Badge variant="outline" className="flex items-center gap-1 bg-fd-background/50">
                                                            Status: {supportStatusFilter}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-4 w-4 ml-1 p-0"
                                                                onClick={() => setSupportStatusFilter(undefined)}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </Badge>
                                                    )}
                                                    {includeEolState && (
                                                        <Badge variant="outline" className="flex items-center gap-1 bg-fd-background/50">
                                                            Including EOL
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-4 w-4 ml-1 p-0"
                                                                onClick={() => setIncludeEolState(false)}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline" className="flex items-center gap-1 bg-fd-background/50">
                                                        Sort: {sortingOptions.sortBy === "version" ? "Version" : "Date"} ({sortingOptions.sortOrder === "desc" ? "Newest" : "Oldest"})
                                                    </Badge>

                                                    {/* Add clear all filters badge if any filters are active */}
                                                    {(search || supportStatusFilter || includeEolState ||
                                                        sortingOptions.sortBy !== "version" || sortingOptions.sortOrder !== "desc") && (
                                                            <Badge
                                                                variant="outline"
                                                                className="flex items-center gap-1 bg-[#5865F2]/10 border-[#5865F2]/20 text-[#5865F2] cursor-pointer"
                                                                onClick={clearAllFilters}
                                                            >
                                                                Clear All Filters
                                                                <X className="h-3 w-3 ml-1" />
                                                            </Badge>
                                                        )}
                                                </div>
                                            </div>

                                            {/* Artifact List */}
                                            <div className="space-y-4">
                                                {Object.entries(artifacts.data[platformKey as keyof typeof artifacts.data] || {}).length > 0 ? (
                                                    Object.entries(artifacts.data[platformKey as keyof typeof artifacts.data] || {})
                                                        .map(([version, artifact]) => (
                                                            <Card
                                                                key={version}
                                                                className={cn(
                                                                    "border border-[#5865F2]/20 transition-all hover:border-[#5865F2]/50",
                                                                    getStatusBgColor(artifact.supportStatus)
                                                                )}
                                                            >
                                                                <CardHeader className="pb-2">
                                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                                        <div className="flex items-start md:items-center gap-2 flex-wrap">
                                                                            <h3 className="text-lg font-bold">Version {version}</h3>
                                                                            <div className="flex flex-wrap gap-1.5">
                                                                                <Badge
                                                                                    className={getStatusColor(artifact.supportStatus)}
                                                                                >
                                                                                    {artifact.supportStatus}
                                                                                </Badge>
                                                                                {artifact.critical && (
                                                                                    <Badge variant="destructive">
                                                                                        Critical
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <span className="text-sm text-muted-foreground">
                                                                                Released {formatDate(artifact.published_at)}
                                                                            </span>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => handleCopyVersion(version)}
                                                                            >
                                                                                <Copy className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <p className="text-sm text-muted-foreground mb-2">
                                                                        {artifact.supportStatus === "recommended" && "👍 Supported: ends " + formatDate(artifact.supportEnds)}
                                                                        {artifact.supportStatus === "latest" && "👍 Supported: ends " + formatDate(artifact.supportEnds)}
                                                                        {artifact.supportStatus === "active" && "👍 Supported: ends " + formatDate(artifact.supportEnds)}
                                                                        {artifact.supportStatus === "deprecated" && "👎 Unsupported: as of " + formatDate(artifact.supportEnds)}
                                                                        {artifact.supportStatus === "eol" && "☠️ End of life: no longer supported"}
                                                                    </p>
                                                                </CardContent>
                                                                <CardFooter className="pt-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button variant="outline" size="sm">Download Options</Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="start" className="bg-fd-background/80 border border-[#5865F2]/20">
                                                                                <DropdownMenuItem onClick={() => handleDownload(artifact.download_urls.zip)}>
                                                                                    {platformKey === 'windows' ? 'Download ZIP' : 'Download tar.xz'}
                                                                                </DropdownMenuItem>
                                                                                {platformKey === 'windows' && (
                                                                                    <DropdownMenuItem onClick={() => handleDownload(artifact.download_urls["7z"])}>
                                                                                        Download 7z
                                                                                    </DropdownMenuItem>
                                                                                )}
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            asChild
                                                                        >
                                                                            <a
                                                                                href={artifact.artifact_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex items-center"
                                                                            >
                                                                                <ExternalLink className="h-4 w-4 mr-1" />
                                                                                View Artifact
                                                                            </a>
                                                                        </Button>
                                                                    </div>
                                                                    {artifact.eol && (
                                                                        <Alert className="m-0 py-2 px-3 h-auto">
                                                                            <AlertCircle className="h-4 w-4" />
                                                                            <AlertDescription className="text-xs">
                                                                                This artifact is EOL and may not work with the latest server browser.
                                                                            </AlertDescription>
                                                                        </Alert>
                                                                    )}
                                                                </CardFooter>
                                                            </Card>
                                                        ))
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-12">
                                                        <p className="text-center text-muted-foreground mb-4">
                                                            No artifacts found matching your criteria.
                                                        </p>
                                                        <Button
                                                            variant="outline"
                                                            onClick={clearAllFilters}
                                                        >
                                                            Clear All Filters
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Pagination */}
                                            {artifacts.metadata.pagination.totalPages > 1 && (
                                                <div className="flex items-center justify-center gap-2 py-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        First
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    <span className="text-sm mx-2">
                                                        Page {currentPage} of {artifacts.metadata.pagination.totalPages}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === artifacts.metadata.pagination.totalPages}
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(artifacts.metadata.pagination.totalPages)}
                                                        disabled={currentPage === artifacts.metadata.pagination.totalPages}
                                                    >
                                                        Last
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Alert className="mb-6">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>No Data</AlertTitle>
                                            <AlertDescription>
                                                No artifacts data available for this platform.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </TabsContent>
                            ))}
                        </div>
                    </ScrollArea>
                </Tabs>
            </div>
        </div>
    );
}
