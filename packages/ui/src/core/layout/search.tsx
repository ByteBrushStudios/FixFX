"use client";

import { Search } from "lucide-react";
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

  return (
    <div className="relative w-full max-w-md">
      <div className="bg-fd-background border-fd-border flex items-center rounded-full border px-4 py-2">
        <Search className="text-fd-muted-foreground mr-2 h-5 w-5" />
        <input
          type="text"
          placeholder="Search for guides, frameworks, or error codes..."
          className="bg-transparent flex-grow focus:outline-none text-fd-foreground"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      <AnimatePresence>
        {isOpen && (query.length > 0 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-full rounded-lg border border-fd-border bg-fd-background shadow-lg"
          >
            {isLoading ? (
              <div className="p-4 text-center text-fd-muted-foreground">
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    className="block p-4 hover:bg-fd-accent/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-fd-muted-foreground text-sm">
                        {result.type === "page" && "📄"}
                        {result.type === "heading" && "🔍"}
                        {result.type === "text" && "📝"}
                      </span>
                      <span className="text-fd-foreground">
                        {result.content}
                      </span>
                    </div>
                    <div className="text-fd-muted-foreground text-xs mt-1">
                      {result.url}
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length > 0 ? (
              <div className="p-4 text-center text-fd-muted-foreground">
                No results found
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 