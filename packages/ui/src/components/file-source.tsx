'use client';

import { useEffect, useState } from 'react';import { API_URL } from "@/packages/utils/src/constants/link";import { SourceCode } from '@ui/components';

interface FileSourceProps {
  filePath: string;
  title?: string | { text: string; href: string };
}

const languageMap: Record<string, string> = {
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.js': 'javascript',
  '.jsx': 'jsx',
  '.json': 'json',
  '.md': 'markdown',
  '.mdx': 'mdx',
  '.css': 'css',
  '.scss': 'scss',
  '.html': 'html',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.sh': 'bash',
  '.bash': 'bash',
  '.sql': 'sql',
  '.lua': 'lua',
  '.go': 'go',
  '.mod': 'go',
  '.sum': 'text',
  '.py': 'python',
  '.rb': 'ruby',
  '.java': 'java',
  '.cs': 'csharp',
  '.cpp': 'cpp',
  '.c': 'c',
  '.h': 'c',
  '.hpp': 'cpp',
  '.xml': 'xml',
  '.toml': 'toml',
  '.env': 'bash',
};

function getLanguage(filePath: string): string {
  const ext = filePath.substring(filePath.lastIndexOf('.'));
  return languageMap[ext] || 'text';
}

export function FileSource({ filePath, title }: FileSourceProps) {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCode() {
      try {
        const res = await fetch(`${API_URL}/api/source?path=${encodeURIComponent(filePath)}`);
        if (!res.ok) {
          throw new Error('Failed to load file');
        }
        const data = await res.json();
        setCode(data.code);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchCode();
  }, [filePath]);

  if (loading) {
    return (
      <div className="rounded-lg border border-fd-border bg-fd-card p-4">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading source code...</span>
        </div>
      </div>
    );
  }

  if (error || !code) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
        <p className="font-medium">Error loading file</p>
        <p className="text-sm opacity-80">Could not load: {filePath}</p>
      </div>
    );
  }

  return <SourceCode code={code} lang={getLanguage(filePath)} title={title} />;
}
