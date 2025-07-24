"use client"

import { useEffect, useState, useRef, useMemo } from 'react';
import { Button } from '@ui/components/button';
import { ScrollArea } from '@ui/components/scroll-area';
import { useFetch } from '@core/useFetch';
import { Code, Copy, Check, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { cn } from '@utils/functions/cn';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface Native {
    name: string;
    params: {
        name: string;
        type: string;
        description?: string;
    }[];
    results: string;
    description: string;
    hash: string;
    jhash?: string;
    ns: string;
    resultsDescription?: string;
    environment: 'client' | 'server' | 'shared';
    apiset?: string;
    url?: string;
    category: string;
    game?: string;
    isCfx?: boolean;
}

interface NativesContentProps {
    game: 'gta5' | 'rdr3';
    environment: 'all' | 'client' | 'server';
    category: string;
    searchQuery: string;
    includeCFX: boolean;
}

export function NativesContent({ game, environment, category, searchQuery, includeCFX }: NativesContentProps) {
    const [page, setPage] = useState(1);
    const [expandedNative, setExpandedNative] = useState<string | null>(null);
    const [copiedHash, setCopiedHash] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // Track filter changes to reset pagination
    const prevFilters = useRef({ game, environment, category, searchQuery, includeCFX });

    useEffect(() => {
        const currentFilters = { game, environment, category, searchQuery, includeCFX };
        if (JSON.stringify(prevFilters.current) !== JSON.stringify(currentFilters)) {
            setPage(1); // Reset to first page when filters change
            prevFilters.current = currentFilters;
        }
    }, [game, environment, category, searchQuery, includeCFX]);

    // Construct API URL with all parameters
    const apiUrl = useMemo(() => {
        const params = new URLSearchParams({
            game,
            limit: '20',
            offset: ((page - 1) * 20).toString(),
            cfx: includeCFX.toString()
        });

        if (environment !== 'all') params.set('environment', environment);
        if (category) params.set('ns', category);
        if (searchQuery) params.set('search', searchQuery);

        return `/api/natives?${params.toString()}`;
    }, [game, environment, category, searchQuery, includeCFX, page]);

    // Use the enhanced fetch hook
    const { data, isPending, error } = useFetch<{
        data: Native[],
        metadata: {
            total: number,
            limit: number,
            offset: number,
            hasMore: boolean,
            environmentStats: {
                client: number,
                server: number,
                shared: number,
                total: number
            }
        }
    }>(apiUrl);

    const natives = data?.data || [];
    const metadata = data?.metadata;
    const totalResults = metadata?.total || 0;
    const totalPages = Math.ceil((metadata?.total || 0) / 20);
    const totalEnvironmentStats = metadata?.environmentStats;

    const handleCopyHash = (hash: string) => {
        navigator.clipboard.writeText('0x' + hash);
        setCopiedHash(hash);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    const toggleExpandedNative = (hash: string) => {
        setExpandedNative(expandedNative === hash ? null : hash);
    };

    const renderNative = (native: Native) => {
        const isCfx = native.ns === 'CFX' || native.isCfx;

        const environmentClass = native.environment === 'server' ?
            'from-green-500/5 to-transparent border-l-green-500/50' :
            native.environment === 'shared' ?
                'from-purple-500/5 to-transparent border-l-purple-500/50' :
                'from-blue-500/5 to-transparent border-l-blue-500/50';

        const environmentLabel =
            native.environment === 'server' ? 'Server' :
                native.environment === 'shared' ? 'Shared' :
                    'Client';

        const environmentBadgeClass =
            native.environment === 'server' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                native.environment === 'shared' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                    'bg-blue-500/20 text-blue-300 border-blue-500/30';

        const renderMarkdown = (content: string) => {
            return (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const language = match ? match[1] : '';
                            const code = String(children).replace(/\n$/, '');

                            if (!inline && language) {
                                return (
                                    <div className="relative group my-2 rounded-md overflow-hidden">
                                        <div className="flex items-center justify-between bg-gray-800 px-2 py-1 text-xs font-mono text-gray-300">
                                            <span>{language}</span>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-5 w-5 text-gray-400 hover:text-white"
                                                onClick={() => handleCopyCode(code)}
                                            >
                                                {copiedCode === code ? (
                                                    <Check className="h-3 w-3" />
                                                ) : (
                                                    <Copy className="h-3 w-3" />
                                                )}
                                            </Button>
                                        </div>
                                        <SyntaxHighlighter
                                            language={language}
                                            style={vscDarkPlus}
                                            customStyle={{ margin: 0, borderRadius: '0px', padding: '0.5rem' }}
                                            wrapLongLines={true}
                                            {...props}
                                        >
                                            {code}
                                        </SyntaxHighlighter>
                                    </div>
                                );
                            }
                            return <code className="bg-gray-800/50 px-1 py-0.5 rounded text-sm" {...props}>{children}</code>;
                        },
                        p({ children }) {
                            return <p className="mb-2 last:mb-0 text-muted-foreground">{children}</p>;
                        },
                        ul({ children }) {
                            return <ul className="list-disc pl-4 mb-2 text-xs text-muted-foreground">{children}</ul>;
                        },
                        li({ children }) {
                            return <li className="mb-1">{children}</li>;
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            );
        };

        const handleCopyCode = (code: string) => {
            navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        };

        return (
            <div className="space-y-3">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold font-mono flex items-center gap-2 group break-all sm:break-normal">
                        <span className="truncate max-w-[calc(100%-2rem)]" title={native.name}>{native.name}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground opacity-50 group-hover:opacity-100 flex-shrink-0"
                            onClick={() => handleCopyHash(native.hash)}
                        >
                            {copiedHash === native.hash ? (
                                <Check className="h-3.5 w-3.5" />
                            ) : (
                                <Copy className="h-3.5 w-3.5" />
                            )}
                        </Button>
                    </h3>

                    <div className="text-xs font-mono text-muted-foreground">
                        {native.hash} {native.jhash ? `(${native.jhash})` : ''}
                    </div>
                </div>

                <div className="mt-2">
                    {native.description ?
                        renderMarkdown(native.description) :
                        <p className="text-sm text-muted-foreground">No description available.</p>
                    }
                </div>

                {native.params.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium mb-1">Parameters</h4>
                        <div className="bg-gray-800/50 rounded-md p-3 space-y-2">
                            {native.params.map((param, index) => (
                                <div key={index} className="grid grid-cols-[100px_1fr] text-sm">
                                    <div className="font-mono text-xs text-blue-400">{param.type}</div>
                                    <div>
                                        <span className="font-mono text-amber-300">{param.name}</span>
                                        {param.description && (
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {renderMarkdown(param.description)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h4 className="text-sm font-medium mb-1">Returns</h4>
                    <div className="bg-gray-800/50 rounded-md p-3">
                        <div className="grid grid-cols-[100px_1fr] text-sm">
                            <div className="font-mono text-xs text-blue-400">{native.results}</div>
                            <div className="text-xs text-muted-foreground">
                                {native.resultsDescription ?
                                    renderMarkdown(native.resultsDescription) :
                                    "No return description available."
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs bg-gray-700/50 px-2 py-0.5 rounded text-muted-foreground">
                            {native.ns}
                        </span>

                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${environmentBadgeClass}`}>
                            {environmentLabel}
                        </span>

                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400 border border-gray-500/10">
                            {native.game === 'gta5' ? 'GTA V' : 'RDR3'}
                        </span>

                        {isCfx && (
                            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/10">
                                CFX
                            </span>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setExpandedNative(expandedNative === native.hash ? null : native.hash)}
                    >
                        {expandedNative === native.hash ? "Less" : "More"}
                    </Button>
                </div>

                {expandedNative === native.hash && (
                    <div className="pt-3 mt-2 border-t border-gray-700/50 space-y-3">
                        {/* Expanded content */}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-[#5865F2]/20 bg-fd-background/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {game === 'gta5' ? 'GTA V' : 'RDR3'} Natives
                            {includeCFX && (
                                <span className="text-xs bg-[#5865F2]/20 text-[#5865F2] py-0.5 px-1.5 rounded">
                                    +CFX
                                </span>
                            )}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {isPending ? 'Loading...' : `Found ${totalResults.toLocaleString()} natives`}
                            {searchQuery && ` matching "${searchQuery}"`}
                        </p>
                    </div>

                    {totalEnvironmentStats && (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="size-2.5 rounded-full bg-green-500"></div>
                                <span className="text-xs text-muted-foreground">{totalEnvironmentStats.client} Client</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="size-2.5 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-muted-foreground">{totalEnvironmentStats.server} Server</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="size-2.5 rounded-full bg-purple-500"></div>
                                <span className="text-xs text-muted-foreground">{totalEnvironmentStats.shared} Shared</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isPending ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="h-8 w-8 border-t-2 border-r-2 border-[#5865F2] rounded-full animate-spin mb-3"></div>
                        <p className="text-sm text-muted-foreground">Loading natives...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-md p-4 text-center">
                        <h3 className="text-lg font-semibold mb-2 text-red-500">Error loading natives</h3>
                        <p className="text-sm text-muted-foreground">{String(error)}</p>
                        <Button
                            onClick={() => setForceRefreshKey(prev => prev + 1)}
                            variant="outline"
                            className="mt-4"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            ) : natives.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-md p-4 text-center">
                        <h3 className="text-lg font-semibold mb-2">No natives found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filters to find what you're looking for. It is also highly possible that you need to enable the "Include CFX Natives option."
                        </p>
                        {searchQuery && (
                            <Button
                                onClick={() => window.location.href = `/natives?game=${game}`}
                                variant="outline"
                                className="mt-4"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    <div className="divide-y divide-[#5865F2]/10">
                        {natives.map((native) => (
                            <div
                                key={native.hash}
                                className="p-4 transition-all duration-300 group relative"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${native.environment === 'server' ? 'from-green-500/70 via-green-500/50 to-green-500/30' :
                                    native.environment === 'shared' ? 'from-purple-500/70 via-purple-500/50 to-purple-500/30' :
                                        'from-blue-500/70 via-blue-500/50 to-blue-500/30'
                                    } opacity-80 group-hover:opacity-100`}></div>

                                <div className={`absolute inset-0 bg-gradient-to-r ${native.environment === 'server' ? 'from-green-500/5 to-transparent' :
                                    native.environment === 'shared' ? 'from-purple-500/5 to-transparent' :
                                        'from-blue-500/5 to-transparent'
                                    } opacity-70 group-hover:opacity-100`}></div>

                                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-transparent group-hover:via-[#5865F2]/50 group-hover:to-transparent transition-all duration-700"></div>

                                <div className="relative z-10 transition-all duration-300 rounded-r-lg overflow-hidden group-hover:shadow-[0_2px_10px_rgba(88,101,242,0.1)]">
                                    {renderNative(native)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-4 border-t border-[#5865F2]/10">
                            <div className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (page <= 3) {
                                            pageNum = i + 1;
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            if (i === 0) {
                                                pageNum = 1;
                                            } else if (i === 4) {
                                                pageNum = totalPages;
                                            } else {
                                                pageNum = page - 1 + (i - 1);
                                            }
                                        }

                                        // Check if we need ellipsis
                                        if ((pageNum > 2 && pageNum - 1 !== 1 && pageNum - 1 !== page - 1 && pageNum - 1 !== totalPages - 1) ||
                                            (pageNum < totalPages - 1 && pageNum + 1 !== page + 1 && pageNum + 1 !== totalPages && pageNum + 1 !== 2)) {
                                            return (
                                                <span key={`ellipsis-${i}`} className="w-8 text-center">...</span>
                                            );
                                        }

                                        return (
                                            <Button
                                                key={`page-${pageNum}`}
                                                variant={page === pageNum ? "default" : "outline"}
                                                size="sm"
                                                className="w-8 h-8 p-0"
                                                onClick={() => setPage(pageNum)}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
