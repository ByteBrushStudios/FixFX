"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface GuidelinesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuidelinesModal({ open, onOpenChange }: GuidelinesModalProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const fetchGuidelines = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/guidelines");
        const data = await response.json();
        if (data.success) {
          setContent(data.content);
        }
      } catch (error) {
        console.error("Failed to fetch guidelines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuidelines();
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!mounted) return null;

  const modal = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999] bg-black/80"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="fixed top-4 right-4 z-[1001] rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors pointer-events-auto"
          aria-label="Close guidelines"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Dialog Container */}
        <div className="pointer-events-auto relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg border border-fd-border bg-fd-card">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-fd-foreground mb-6">
              Partnership Guidelines & Code of Conduct
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-fd-border border-t-fd-primary mx-auto" />
                  <p className="text-sm text-fd-muted-foreground">
                    Loading guidelines...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {content.split("\n").map((line, idx) => {
                  if (!line.trim()) return <div key={idx} className="h-2" />;

                  // Headings
                  if (line.startsWith("# ")) {
                    return (
                      <h1
                        key={idx}
                        className="mt-6 text-2xl font-bold text-fd-foreground first:mt-0"
                      >
                        {line.replace(/^# /, "")}
                      </h1>
                    );
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h2
                        key={idx}
                        className="mt-5 text-xl font-bold text-fd-foreground"
                      >
                        {line.replace(/^## /, "")}
                      </h2>
                    );
                  }
                  if (line.startsWith("### ")) {
                    return (
                      <h3
                        key={idx}
                        className="mt-4 text-lg font-semibold text-fd-foreground"
                      >
                        {line.replace(/^### /, "")}
                      </h3>
                    );
                  }

                  // Lists
                  if (line.startsWith("- ")) {
                    return (
                      <div
                        key={idx}
                        className="flex gap-3 ml-4 text-fd-muted-foreground text-sm"
                      >
                        <span className="text-green-500 font-bold shrink-0">
                          •
                        </span>
                        <p>{formatMarkdownText(line.replace(/^- /, ""))}</p>
                      </div>
                    );
                  }

                  // Regular paragraphs
                  return (
                    <p
                      key={idx}
                      className="text-fd-muted-foreground leading-relaxed text-sm"
                    >
                      {formatMarkdownText(line)}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(open ? modal : null, document.body);
}

function formatMarkdownText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Handle [links](url), **bold**, _italic_, and `code`
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|_([^_]+)_|`([^`]+)`/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add formatted text
    if (match[1] && match[2]) {
      // Link: [text](url)
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fd-primary hover:underline"
        >
          {match[1]}
        </a>,
      );
    } else if (match[3]) {
      parts.push(
        <strong key={match.index} className="font-semibold text-fd-foreground">
          {match[3]}
        </strong>,
      );
    } else if (match[4]) {
      parts.push(
        <em key={match.index} className="italic text-fd-foreground">
          {match[4]}
        </em>,
      );
    } else if (match[5]) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-fd-muted px-1.5 py-0.5 font-mono text-xs text-fd-foreground"
        >
          {match[5]}
        </code>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
