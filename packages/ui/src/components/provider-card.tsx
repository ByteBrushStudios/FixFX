"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Server,
  Shield,
  Copy,
  Check,
  ExternalLink,
  Percent,
  Clock,
  Globe,
  Award,
} from "lucide-react";
import { cn } from "@utils/functions/";
import type { HostingProvider } from "@/lib/providers";

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors hover:bg-fd-muted",
        className
      )}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export function ProviderCard({ provider }: { provider: HostingProvider }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-fd-border bg-fd-card transition-all duration-300 hover:border-fd-primary/50 hover:shadow-lg hover:shadow-fd-primary/5">
      {/* CFX Trusted Badge */}
      {provider.isTrusted && (
        <div className="absolute right-2 top-2 z-10 sm:right-4 sm:top-4">
          <span className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-2.5 py-1 text-xs font-medium text-blue-400 ring-1 ring-blue-500/30 sm:px-3 sm:py-1 sm:text-xs">
            <Award className="h-3 w-3 shrink-0" />
            <span className="hidden sm:inline">CFX Trusted</span>
            <span className="inline sm:hidden">Trusted</span>
          </span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-fd-border bg-fd-muted/30 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-fd-background ring-1 ring-fd-border">
            <Server className="h-8 w-8 text-fd-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-fd-foreground">{provider.name}</h3>
            <p className="mt-1 text-sm text-fd-muted-foreground line-clamp-2">
              {provider.description}
            </p>
          </div>
        </div>
      </div>

      {/* Discount section */}
      <div className="border-b border-fd-border bg-gradient-to-r from-green-500/5 to-emerald-500/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/30">
              <Percent className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{provider.discount.percentage}% OFF</p>
              <div className="flex items-center gap-1.5 text-sm text-fd-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {provider.discount.duration}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2">
            <code className="font-mono text-lg font-semibold text-fd-foreground">
              {provider.discount.code}
            </code>
            <CopyButton text={provider.discount.code} />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="border-b border-fd-border p-6">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-fd-muted-foreground">
          <Globe className="h-4 w-4" />
          Quick Links
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {provider.links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center justify-between rounded-lg border border-fd-border bg-fd-background p-4 transition-all hover:border-fd-primary/50 hover:bg-fd-muted/50"
            >
              <div>
                <p className="font-medium text-fd-foreground group-hover/link:text-fd-primary">
                  {link.label}
                </p>
                <p className="text-sm text-fd-muted-foreground">{link.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-fd-muted-foreground transition-transform group-hover/link:translate-x-0.5 group-hover/link:text-fd-primary" />
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="p-6">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-fd-muted-foreground">
          <Shield className="h-4 w-4" />
          Features Included
        </h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {provider.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-fd-muted-foreground">
              <Check className="h-4 w-4 shrink-0 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
