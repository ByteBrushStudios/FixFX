"use client";

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

interface SourceCodeProps {
  code: string;
  lang?: string;
  title?: string;
}

export function SourceCode({ code, lang = 'typescript', title }: SourceCodeProps) {
  return (
    <div className="relative">
      {title && (
        <div className="bg-fd-muted/50 border-b border-fd-border px-4 py-2 text-sm font-medium text-fd-muted-foreground rounded-t-lg">
          {title}
        </div>
      )}
      <DynamicCodeBlock 
        lang={lang} 
        code={code}
        options={{
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        }}
      />
    </div>
  );
}
