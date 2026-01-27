"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

interface SourceCodeProps {
  code: string;
  lang?: string;
  title?: string | { text: string; href: string };
}

export function SourceCode({
  code,
  lang = "typescript",
  title,
}: SourceCodeProps) {
  return (
    <div className="relative">
      {title && (
        <div className="bg-fd-muted/50 border-b border-fd-border px-4 py-2 text-sm font-medium text-fd-muted-foreground rounded-t-lg">
          {typeof title === "string" ? (
            title
          ) : (
            <a
              href={title.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 hover:underline transition-colors"
              title="Click to view source"
            >
              {title.text}
            </a>
          )}
        </div>
      )}
      <DynamicCodeBlock
        lang={lang}
        code={code}
        options={{
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        }}
      />
    </div>
  );
}
