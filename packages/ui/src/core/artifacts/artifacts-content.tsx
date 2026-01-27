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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/packages/ui/src/components/accordion";
import { cn } from "@/packages/utils/src/functions/cn";
import { API_URL } from "@/packages/utils/src/constants/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import {
    Search,
    Server,
    ServerCrash,
    Filter,
    X,
    AlertCircle,
    Copy,
    Download,
    Check,
    Calendar,
    HardDrive,
    Hash,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Zap,
    Terminal,
    ChevronDown
} from "lucide-react";

// Types
interface Artifact {
    version: string;
    fullVersion: string;  // Full version string for Pterodactyl like v1.0.0.12345
    platform: 'windows' | 'linux';
    hash: string;
    url: string;
    size: number;
    date: string;
    supportStatus: "recommended" | "latest" | "active" | "deprecated" | "eol";
}

interface ArtifactsResponse {
    data: Artifact[];
    metadata: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
        platforms: string[];
        supportStatuses: string[];
        stats: {
            total: number;
            recommended: number;
            latest: number;
            active: number;
            deprecated: number;
            eol: number;
        };
        query: {
            platform?: string;
            version?: string;
            status?: string;
            limit: number;
            offset: number;
            sortBy: string;
            sortOrder: string;
            includeEol: boolean;
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
    const [copiedVersion, setCopiedVersion] = useState<string | null>(null);
    const [copiedPtero, setCopiedPtero] = useState<string | null>(null);

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
            params.set('includeEol', includeEolState.toString());
            params.set('sortBy', sortingOptions.sortBy);
            params.set('sortOrder', sortingOptions.sortOrder);
            params.set('limit', limit.toString());
            params.set('offset', offset.toString());

            console.log("Fetching artifacts with params:", params.toString());
            const response = await fetch(`${API_URL}/api/artifacts/fetch?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Error fetching artifacts: ${response.status}`);
            }

            const data = await response.json();
            console.log("API response:", data);

            // Normalize the API response - map capitalized keys to lowercase
            const normalizedData = {
                data: data.data.map((artifact: any) => ({
                    version: artifact.Version,
                    fullVersion: artifact.FullVersion || `${artifact.Version}-${artifact.Hash}`,
                    hash: artifact.Hash,
                    platform: artifact.Platform.toLowerCase(),
                    url: artifact.URL,
                    size: artifact.Size,
                    date: artifact.Date,
                    supportStatus: artifact.SupportStatus.toLowerCase(),
                })),
                metadata: data.metadata,
            };

            // Set the normalized artifacts
            setArtifacts(normalizedData);
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
        setCopiedVersion(version);
        setTimeout(() => setCopiedVersion(null), 2000);
    };

    const handleCopyPteroVersion = (fullVersion: string) => {
        navigator.clipboard.writeText(fullVersion);
        setCopiedPtero(fullVersion);
        setTimeout(() => setCopiedPtero(null), 2000);
    };

    // Status icon component
    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'recommended':
                return <Sparkles className="h-4 w-4" />;
            case 'latest':
                return <Zap className="h-4 w-4" />;
            default:
                return null;
        }
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
                                    ) : artifacts && artifacts.data && artifacts.data.length > 0 ? (
                                        <div className="space-y-6">
                                            {/* Recommended & Latest Artifacts - Featured Cards */}
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {/* Recommended Artifact */}
                                                {(() => {
                                                    const recommendedArtifact = artifacts.data.find(
                                                        artifact => artifact.platform === platformKey && artifact.supportStatus === 'recommended'
                                                    );
                                                    return recommendedArtifact ? (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <Card className="group relative overflow-hidden border-green-500/30 bg-gradient-to-br from-green-500/5 via-transparent to-transparent hover:border-green-500/50 transition-all duration-300">
                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                                                <CardHeader className="pb-3">
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="p-1.5 rounded-lg bg-green-500/20">
                                                                                    <Sparkles className="h-4 w-4 text-green-500" />
                                                                                </div>
                                                                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                                                                                    Recommended
                                                                                </Badge>
                                                                            </div>
                                                                            <CardDescription className="text-muted-foreground">Best choice for production servers</CardDescription>
                                                                        </div>
                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className="h-8 w-8 text-muted-foreground hover:text-green-500"
                                                                                        onClick={() => handleCopyVersion(recommendedArtifact.version)}
                                                                                    >
                                                                                        {copiedVersion === recommendedArtifact.version ? (
                                                                                            <Check className="h-4 w-4 text-green-500" />
                                                                                        ) : (
                                                                                            <Copy className="h-4 w-4" />
                                                                                        )}
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Copy version number</TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    </div>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                    <div>
                                                                        <h3 className="text-3xl font-bold tracking-tight text-green-500">
                                                                            {recommendedArtifact.version}
                                                                        </h3>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <Calendar className="h-3.5 w-3.5" />
                                                                            <span>{formatDate(recommendedArtifact.date)}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <HardDrive className="h-3.5 w-3.5" />
                                                                            <span>{(recommendedArtifact.size / 1024 / 1024).toFixed(1)} MB</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                                                                            <Hash className="h-3.5 w-3.5" />
                                                                            <span className="font-mono text-xs">{recommendedArtifact.hash.substring(0, 12)}</span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Hosting Panel Version Info */}
                                                                    <Accordion type="single" collapsible className="w-full">
                                                                        <AccordionItem value="hosting" className="border-green-500/20">
                                                                            <AccordionTrigger className="text-sm py-2 hover:no-underline">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Terminal className="h-3.5 w-3.5 text-green-500" />
                                                                                    <span>Hosting Panel Versions</span>
                                                                                </div>
                                                                            </AccordionTrigger>
                                                                            <AccordionContent>
                                                                                <div className="space-y-3 pt-2">
                                                                                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                                                                                        <div className="flex items-center justify-between mb-2">
                                                                                            <span className="text-xs font-medium text-green-400">Pterodactyl / Pelican</span>
                                                                                            <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                className="h-6 px-2 text-xs"
                                                                                                onClick={() => handleCopyPteroVersion(recommendedArtifact.fullVersion)}
                                                                                            >
                                                                                                {copiedPtero === recommendedArtifact.fullVersion ? (
                                                                                                    <><Check className="h-3 w-3 mr-1 text-green-500" /> Copied!</>
                                                                                                ) : (
                                                                                                    <><Copy className="h-3 w-3 mr-1" /> Copy</>
                                                                                                )}
                                                                                            </Button>
                                                                                        </div>
                                                                                        <code className="text-sm font-mono text-green-300 bg-black/20 px-2 py-1 rounded block">
                                                                                            {recommendedArtifact.fullVersion}
                                                                                        </code>
                                                                                    </div>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        Use this version string in your Pterodactyl, Pelican, or similar hosting panel's egg configuration.
                                                                                    </p>
                                                                                </div>
                                                                            </AccordionContent>
                                                                        </AccordionItem>
                                                                    </Accordion>
                                                                </CardContent>
                                                                <CardFooter>
                                                                    <Button
                                                                        className="w-full bg-green-600 hover:bg-green-700 text-white transition-all group-hover:shadow-lg group-hover:shadow-green-500/20"
                                                                        onClick={() => handleDownload(recommendedArtifact.url)}
                                                                    >
                                                                        <Download className="h-4 w-4 mr-2" />
                                                                        Download {recommendedArtifact.platform === 'windows' ? 'ZIP' : 'TAR.XZ'}
                                                                    </Button>
                                                                </CardFooter>
                                                            </Card>
                                                        </motion.div>
                                                    ) : null;
                                                })()}

                                                {/* Latest Artifact */}
                                                {(() => {
                                                    const latestArtifact = artifacts.data.find(
                                                        artifact => artifact.platform === platformKey && artifact.supportStatus === 'latest'
                                                    );
                                                    return latestArtifact ? (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: 0.1 }}
                                                        >
                                                            <Card className="group relative overflow-hidden border-blue-500/30 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent hover:border-blue-500/50 transition-all duration-300">
                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                                                <CardHeader className="pb-3">
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="p-1.5 rounded-lg bg-blue-500/20">
                                                                                    <Zap className="h-4 w-4 text-blue-500" />
                                                                                </div>
                                                                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30">
                                                                                    Latest
                                                                                </Badge>
                                                                            </div>
                                                                            <CardDescription className="text-muted-foreground">Newest build for testing</CardDescription>
                                                                        </div>
                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                                                                                        onClick={() => handleCopyVersion(latestArtifact.version)}
                                                                                    >
                                                                                        {copiedVersion === latestArtifact.version ? (
                                                                                            <Check className="h-4 w-4 text-blue-500" />
                                                                                        ) : (
                                                                                            <Copy className="h-4 w-4" />
                                                                                        )}
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Copy version number</TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    </div>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                    <div>
                                                                        <h3 className="text-3xl font-bold tracking-tight text-blue-500">
                                                                            {latestArtifact.version}
                                                                        </h3>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <Calendar className="h-3.5 w-3.5" />
                                                                            <span>{formatDate(latestArtifact.date)}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <HardDrive className="h-3.5 w-3.5" />
                                                                            <span>{(latestArtifact.size / 1024 / 1024).toFixed(1)} MB</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                                                                            <Hash className="h-3.5 w-3.5" />
                                                                            <span className="font-mono text-xs">{latestArtifact.hash.substring(0, 12)}</span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Hosting Panel Version Info */}
                                                                    <Accordion type="single" collapsible className="w-full">
                                                                        <AccordionItem value="hosting" className="border-blue-500/20">
                                                                            <AccordionTrigger className="text-sm py-2 hover:no-underline">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Terminal className="h-3.5 w-3.5 text-blue-500" />
                                                                                    <span>Hosting Panel Versions</span>
                                                                                </div>
                                                                            </AccordionTrigger>
                                                                            <AccordionContent>
                                                                                <div className="space-y-3 pt-2">
                                                                                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                                                                                        <div className="flex items-center justify-between mb-2">
                                                                                            <span className="text-xs font-medium text-blue-400">Pterodactyl / Pelican</span>
                                                                                            <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                className="h-6 px-2 text-xs"
                                                                                                onClick={() => handleCopyPteroVersion(latestArtifact.fullVersion)}
                                                                                            >
                                                                                                {copiedPtero === latestArtifact.fullVersion ? (
                                                                                                    <><Check className="h-3 w-3 mr-1 text-blue-500" /> Copied!</>
                                                                                                ) : (
                                                                                                    <><Copy className="h-3 w-3 mr-1" /> Copy</>
                                                                                                )}
                                                                                            </Button>
                                                                                        </div>
                                                                                        <code className="text-sm font-mono text-blue-300 bg-black/20 px-2 py-1 rounded block">
                                                                                            {latestArtifact.fullVersion}
                                                                                        </code>
                                                                                    </div>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        Use this version string in your Pterodactyl, Pelican, or similar hosting panel's egg configuration.
                                                                                    </p>
                                                                                </div>
                                                                            </AccordionContent>
                                                                        </AccordionItem>
                                                                    </Accordion>
                                                                </CardContent>
                                                                <CardFooter>
                                                                    <Button
                                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all group-hover:shadow-lg group-hover:shadow-blue-500/20"
                                                                        onClick={() => handleDownload(latestArtifact.url)}
                                                                    >
                                                                        <Download className="h-4 w-4 mr-2" />
                                                                        Download {latestArtifact.platform === 'windows' ? 'ZIP' : 'TAR.XZ'}
                                                                    </Button>
                                                                </CardFooter>
                                                            </Card>
                                                        </motion.div>
                                                    ) : null;
                                                })()}
                                            </div>

                                            {/* Stats and Filters */}
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.2 }}
                                                className="rounded-2xl border border-fd-border bg-fd-background/50 backdrop-blur-sm p-5"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                                    <h3 className="text-lg font-semibold">All Artifacts</h3>
                                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                                        {(search || supportStatusFilter || includeEolState) && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={clearAllFilters}
                                                                className="h-7 text-xs text-muted-foreground hover:text-[#5865F2]"
                                                            >
                                                                <X className="h-3 w-3 mr-1" />
                                                                Clear Filters
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                                    <div className="p-3 rounded-xl bg-fd-muted/30 border border-fd-border text-center transition-all hover:bg-fd-muted/50">
                                                        <p className="text-xs text-muted-foreground mb-1">Total</p>
                                                        <p className="text-2xl font-bold">{artifacts.metadata.stats?.total ?? artifacts.metadata.total}</p>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20 text-center transition-all hover:bg-green-500/10">
                                                        <p className="text-xs text-green-400 mb-1">Recommended</p>
                                                        <p className="text-2xl font-bold text-green-500">{artifacts.metadata.stats?.recommended ?? 0}</p>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center transition-all hover:bg-blue-500/10">
                                                        <p className="text-xs text-blue-400 mb-1">Latest</p>
                                                        <p className="text-2xl font-bold text-blue-500">{artifacts.metadata.stats?.latest ?? 0}</p>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-center transition-all hover:bg-cyan-500/10">
                                                        <p className="text-xs text-cyan-400 mb-1">Active</p>
                                                        <p className="text-2xl font-bold text-cyan-500">{artifacts.metadata.stats?.active ?? 0}</p>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-center col-span-2 sm:col-span-1 transition-all hover:bg-red-500/10">
                                                        <p className="text-xs text-red-400 mb-1">EOL</p>
                                                        <p className="text-2xl font-bold text-red-500">{artifacts.metadata.stats?.eol ?? 0}</p>
                                                    </div>
                                                </div>

                                                {/* Active filters display */}
                                                {(search || supportStatusFilter || includeEolState) && (
                                                    <div className="flex flex-wrap items-center gap-2 text-sm mt-4 pt-4 border-t border-fd-border">
                                                        <span className="text-muted-foreground text-xs">Active filters:</span>
                                                        {search && (
                                                            <Badge variant="secondary" className="flex items-center gap-1 bg-fd-muted/50 text-xs">
                                                                Search: {search}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-3 w-3 ml-1 p-0 hover:bg-transparent"
                                                                    onClick={() => setSearch("")}
                                                                >
                                                                    <X className="h-2.5 w-2.5" />
                                                                </Button>
                                                            </Badge>
                                                        )}
                                                        {supportStatusFilter && (
                                                            <Badge variant="secondary" className="flex items-center gap-1 bg-fd-muted/50 text-xs">
                                                                Status: {supportStatusFilter}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-3 w-3 ml-1 p-0 hover:bg-transparent"
                                                                    onClick={() => setSupportStatusFilter(undefined)}
                                                                >
                                                                    <X className="h-2.5 w-2.5" />
                                                                </Button>
                                                            </Badge>
                                                        )}
                                                        {includeEolState && (
                                                            <Badge variant="secondary" className="flex items-center gap-1 bg-fd-muted/50 text-xs">
                                                                Including EOL
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-3 w-3 ml-1 p-0 hover:bg-transparent"
                                                                    onClick={() => setIncludeEolState(false)}
                                                                >
                                                                    <X className="h-2.5 w-2.5" />
                                                                </Button>
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>

                                            {/* Artifact List */}
                                            <div className="space-y-3">
                                                {artifacts.data.filter(artifact => artifact.platform === platformKey).length > 0 ? (
                                                    artifacts.data
                                                        .filter(artifact => artifact.platform === platformKey)
                                                        .map((artifact, index) => (
                                                            <motion.div
                                                                key={`${artifact.platform}-${artifact.version}`}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.2, delay: index * 0.03 }}
                                                            >
                                                                <div
                                                                    className={cn(
                                                                        "group relative rounded-xl border bg-fd-background/50 backdrop-blur-sm p-4 transition-all duration-300 hover:shadow-md",
                                                                        artifact.supportStatus === 'recommended' && "border-green-500/20 hover:border-green-500/40",
                                                                        artifact.supportStatus === 'latest' && "border-blue-500/20 hover:border-blue-500/40",
                                                                        artifact.supportStatus === 'active' && "border-cyan-500/20 hover:border-cyan-500/40",
                                                                        artifact.supportStatus === 'deprecated' && "border-amber-500/20 hover:border-amber-500/40",
                                                                        artifact.supportStatus === 'eol' && "border-red-500/20 hover:border-red-500/40",
                                                                        !['recommended', 'latest', 'active', 'deprecated', 'eol'].includes(artifact.supportStatus) && "border-fd-border hover:border-[#5865F2]/40"
                                                                    )}
                                                                >
                                                                    {/* Subtle gradient overlay */}
                                                                    <div className={cn(
                                                                        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                                                                        artifact.supportStatus === 'recommended' && "bg-gradient-to-r from-green-500/5 to-transparent",
                                                                        artifact.supportStatus === 'latest' && "bg-gradient-to-r from-blue-500/5 to-transparent",
                                                                        artifact.supportStatus === 'active' && "bg-gradient-to-r from-cyan-500/5 to-transparent",
                                                                        artifact.supportStatus === 'deprecated' && "bg-gradient-to-r from-amber-500/5 to-transparent",
                                                                        artifact.supportStatus === 'eol' && "bg-gradient-to-r from-red-500/5 to-transparent"
                                                                    )} />
                                                                    
                                                                    {/* EOL/Deprecated Warning */}
                                                                    {(artifact.supportStatus === 'eol' || artifact.supportStatus === 'deprecated') && (
                                                                        <div className={cn(
                                                                            "relative mb-3 p-2 rounded-lg text-xs flex items-start gap-2",
                                                                            artifact.supportStatus === 'eol' && "bg-red-500/10 border border-red-500/20 text-red-400",
                                                                            artifact.supportStatus === 'deprecated' && "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                                                                        )}>
                                                                            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                                                            <div>
                                                                                <span className="font-medium">
                                                                                    {artifact.supportStatus === 'eol' ? 'End of Life' : 'Deprecated'}
                                                                                </span>
                                                                                <span className="text-muted-foreground ml-1">
                                                                                    - Downloads disabled.
                                                                                    <a 
                                                                                        href="https://aka.cfx.re/eol" 
                                                                                        target="_blank" 
                                                                                        rel="noopener noreferrer"
                                                                                        className={cn(
                                                                                            "ml-1 underline hover:no-underline",
                                                                                            artifact.supportStatus === 'eol' ? "text-red-400" : "text-amber-400"
                                                                                        )}
                                                                                    >
                                                                                        Learn more
                                                                                    </a>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    
                                                                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                                        {/* Left side - Version info */}
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="flex flex-col">
                                                                                <div className="flex items-center gap-2">
                                                                                    <h4 className="text-lg font-semibold">{artifact.version}</h4>
                                                                                    <Badge className={cn(
                                                                                        "text-xs font-medium",
                                                                                        getStatusColor(artifact.supportStatus)
                                                                                    )}>
                                                                                        {artifact.supportStatus}
                                                                                    </Badge>
                                                                                </div>
                                                                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                                                                    <span className="flex items-center gap-1">
                                                                                        <Calendar className="h-3 w-3" />
                                                                                        {formatDate(artifact.date)}
                                                                                    </span>
                                                                                    <span className="flex items-center gap-1">
                                                                                        <HardDrive className="h-3 w-3" />
                                                                                        {(artifact.size / 1024 / 1024).toFixed(1)} MB
                                                                                    </span>
                                                                                    <span className="hidden sm:flex items-center gap-1 font-mono">
                                                                                        <Hash className="h-3 w-3" />
                                                                                        {artifact.hash.substring(0, 8)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Right side - Actions */}
                                                                        <div className="flex items-center gap-2">
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="h-8 w-8 text-muted-foreground hover:text-[#5865F2]"
                                                                                            onClick={() => handleCopyVersion(artifact.version)}
                                                                                        >
                                                                                            {copiedVersion === artifact.version ? (
                                                                                                <Check className="h-4 w-4 text-green-500" />
                                                                                            ) : (
                                                                                                <Copy className="h-4 w-4" />
                                                                                            )}
                                                                                        </Button>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>Copy version</TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="h-8 w-8 text-muted-foreground hover:text-purple-500"
                                                                                            onClick={() => handleCopyPteroVersion(artifact.fullVersion)}
                                                                                        >
                                                                                            {copiedPtero === artifact.fullVersion ? (
                                                                                                <Check className="h-4 w-4 text-green-500" />
                                                                                            ) : (
                                                                                                <Terminal className="h-4 w-4" />
                                                                                            )}
                                                                                        </Button>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>Copy Pterodactyl version ({artifact.fullVersion})</TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <span>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                disabled={artifact.supportStatus === 'deprecated' || artifact.supportStatus === 'eol'}
                                                                                                className={cn(
                                                                                                    "transition-all",
                                                                                                    artifact.supportStatus === 'recommended' && "bg-green-600 hover:bg-green-700",
                                                                                                    artifact.supportStatus === 'latest' && "bg-blue-600 hover:bg-blue-700",
                                                                                                    artifact.supportStatus === 'active' && "bg-cyan-600 hover:bg-cyan-700",
                                                                                                    artifact.supportStatus === 'deprecated' && "bg-amber-600/50 cursor-not-allowed",
                                                                                                    artifact.supportStatus === 'eol' && "bg-red-600/50 cursor-not-allowed",
                                                                                                    !['recommended', 'latest', 'active', 'deprecated', 'eol'].includes(artifact.supportStatus) && "bg-[#5865F2] hover:bg-[#5865F2]/90"
                                                                                                )}
                                                                                                onClick={() => handleDownload(artifact.url)}
                                                                                            >
                                                                                                <Download className="h-4 w-4 mr-1.5" />
                                                                                                Download
                                                                                            </Button>
                                                                                        </span>
                                                                                    </TooltipTrigger>
                                                                                    {(artifact.supportStatus === 'deprecated' || artifact.supportStatus === 'eol') && (
                                                                                        <TooltipContent>
                                                                                            {artifact.supportStatus === 'eol' ? 'End of life' : 'Deprecated'} - Downloads disabled
                                                                                        </TooltipContent>
                                                                                    )}
                                                                                </Tooltip>
                                                                            </TooltipProvider>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
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
                                            {artifacts && artifacts.metadata && (() => {
                                                const totalPages = Math.ceil(artifacts.metadata.total / artifacts.metadata.limit);
                                                const currentPageNum = Math.floor(artifacts.metadata.offset / artifacts.metadata.limit) + 1;
                                                return totalPages > 1;
                                            })() && (
                                                    <div className="flex items-center justify-center gap-2 py-4">
                                                        {(() => {
                                                            const totalPages = Math.ceil(artifacts.metadata.total / artifacts.metadata.limit);
                                                            const currentPageNum = Math.floor(artifacts.metadata.offset / artifacts.metadata.limit) + 1;
                                                            return (
                                                                <>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handlePageChange(1)}
                                                                        disabled={currentPageNum === 1}
                                                                    >
                                                                        First
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handlePageChange(currentPageNum - 1)}
                                                                        disabled={currentPageNum === 1}
                                                                    >
                                                                        <ChevronLeft className="h-4 w-4" />
                                                                    </Button>
                                                                    <span className="text-sm mx-2">
                                                                        Page {currentPageNum} of {totalPages}
                                                                    </span>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handlePageChange(currentPageNum + 1)}
                                                                        disabled={currentPageNum === totalPages}
                                                                    >
                                                                        <ChevronRight className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handlePageChange(totalPages)}
                                                                        disabled={currentPageNum === totalPages}
                                                                    >
                                                                        Last
                                                                    </Button>
                                                                </>
                                                            );
                                                        })()}
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
