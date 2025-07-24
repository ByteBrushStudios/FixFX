"use client";

import { cn } from "@utils/functions/cn";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface CodeEditorProps {
  children: ReactNode;
  className?: string;
  language?: string;
}

export function CodeEditor({ children, className, language = "typescript" }: CodeEditorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
    >
      <div className="overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed">
          <code className={cn("language-" + language)}>{children}</code>
        </pre>
      </div>
      <div className="absolute right-2 top-2 flex items-center gap-2">
        <button
          onClick={() => {
            const code = document.querySelector("code")?.textContent;
            if (code) {
              navigator.clipboard.writeText(code);
            }
          }}
          className="text-fd-muted-foreground hover:text-fd-foreground rounded-md p-1 text-xs transition-colors"
        >
          Copy
        </button>
      </div>
    </motion.div>
  );
} 