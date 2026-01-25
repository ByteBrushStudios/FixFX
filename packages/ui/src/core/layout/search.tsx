"use client";

import { Search, FileText, Heading, Type, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

interface SearchResult {
  id: string;
  type: "page" | "heading" | "text";
  content: string;
  url: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        // Filter and sort results
        const processedResults = data
          .filter((result: SearchResult) => {
            // Prioritize exact matches in content
            const content = result.content.toLowerCase();
            const searchQuery = query.toLowerCase();
            return content.includes(searchQuery);
          })
          .sort((a: SearchResult, b: SearchResult) => {
            // Sort by type priority and content relevance
            const typePriority = { page: 0, heading: 1, text: 2 };
            const aPriority = typePriority[a.type];
            const bPriority = typePriority[b.type];

            if (aPriority !== bPriority) {
              return aPriority - bPriority;
            }

            // If same type, sort by content length (shorter content usually more relevant)
            return a.content.length - b.content.length;
          })
          .slice(0, 5); // Limit to top 5 most relevant results

        setResults(processedResults);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case "page":
        return <FileText className="h-4 w-4" />;
      case "heading":
        return <Heading className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative w-full">
      <div className="group relative">
        {/* Glow effect on focus */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-20" />

        <div className="relative flex items-center rounded-full border border-fd-border bg-fd-background/80 backdrop-blur-sm px-4 py-3 transition-all duration-300 group-focus-within:border-blue-500/50 group-focus-within:bg-fd-background">
          <Search className="text-fd-muted-foreground mr-3 h-5 w-5 transition-colors group-focus-within:text-blue-500" />
          <input
            type="text"
            placeholder="Search docs, guides, error codes..."
            className="flex-grow bg-transparent text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none text-sm md:text-base"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-fd-muted-foreground" />
          )}
          {/* Keyboard shortcut hint */}
          <kbd className="hidden md:inline-flex ml-2 h-6 items-center gap-1 rounded border border-fd-border bg-fd-muted/50 px-2 font-mono text-xs text-fd-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (query.length > 0 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-fd-border bg-fd-background/95 backdrop-blur-lg shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 p-6 text-fd-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Searching...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-80 overflow-y-auto py-2">
                {results.map((result, index) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-fd-accent/10"
                  >
                    <span className="mt-0.5 rounded-md bg-fd-muted/50 p-1.5 text-fd-muted-foreground">
                      {getIcon(result.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate text-sm font-medium text-fd-foreground">
                        {result.content}
                      </span>
                      <span className="block truncate text-xs text-fd-muted-foreground mt-0.5">
                        {result.url}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length > 0 ? (
              <div className="p-6 text-center">
                <p className="text-fd-muted-foreground text-sm">No results found for "{query}"</p>
                <p className="text-fd-muted-foreground/60 text-xs mt-1">Try different keywords</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 