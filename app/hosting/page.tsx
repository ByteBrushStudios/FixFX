"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Server,
  Zap,
  Shield,
  Headphones,
  ExternalLink,
  Percent,
  ChevronRight,
  Handshake,
  Cloud,
} from "lucide-react";
import { ProviderCard, GuidelinesModal } from "@ui/components";

interface Provider {
  id: string;
  name: string;
  website: string;
  logo?: string;
  description: string;
  discount: {
    percentage: number;
    code: string;
  };
  links: {
    label: string;
    url: string;
  }[];
  features?: string[];
  isTrusted?: boolean;
}

export default function HostingPage() {
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providersWithTrust, setProvidersWithTrust] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch providers on mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/providers");
        const data = await response.json();
        if (data.success) {
          const providersData = data.providers as Provider[];
          setProviders(providersData);

          // Fetch trusted hosts
          const trustedResponse = await fetch("/api/trusted-hosts");
          const trustedData = await trustedResponse.json();
          if (trustedData.success) {
            const trustedHosts = trustedData.hosts;
            const withTrust = providersData.map((provider) => ({
              ...provider,
              isTrusted: provider.website
                ? trustedHosts.some((host: any) => {
                    try {
                      const providerUrl = new URL(
                        provider.website,
                      ).hostname.toLowerCase();
                      const hostUrl = new URL(host.url).hostname.toLowerCase();
                      return (
                        providerUrl === hostUrl || providerUrl.includes(hostUrl)
                      );
                    } catch {
                      return false;
                    }
                  })
                : false,
            }));
            setProvidersWithTrust(withTrust);
          }
        }
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const maxDiscount =
    providersWithTrust.length > 0
      ? Math.max(...providersWithTrust.map((p) => p.discount.percentage))
      : 20;

  // Get first provider's links for CTA (fallback to ZAP-Hosting)
  const firstProvider = providersWithTrust[0];
  const fivemLink =
    firstProvider?.links.find((l) => l.label.toLowerCase().includes("fivem"))
      ?.url || "https://zap-hosting.com/FixFXFiveM";
  const redmLink =
    firstProvider?.links.find((l) => l.label.toLowerCase().includes("redm"))
      ?.url || "https://zap-hosting.com/FixFXRedM";
  const vpsLink =
    "https://zap-hosting.com/a/8d785f5b626ef6617320d4bca50a4e344c464437?voucher=FixFX-a-8909";
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-fd-border bg-fd-background">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-green-500/20 to-transparent blur-3xl" />
          <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-gradient-to-bl from-blue-500/15 to-transparent blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-fd-muted-foreground">
            <Link href="/" className="hover:text-fd-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-fd-foreground">Hosting Partners</span>
          </nav>

          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm text-green-400">
              <Zap className="h-4 w-4" />
              <span>Trusted Partners</span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-fd-foreground sm:text-5xl md:text-6xl">
              Hosting{" "}
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                Partners
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto max-w-2xl text-lg text-fd-muted-foreground sm:text-xl">
              We&apos;ve partnered with the best game server hosting providers
              to bring you exclusive discounts. Get your FiveM or RedM server up
              and running with trusted, high-performance hosting.
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              <div className="text-center">
                {loading ? (
                  <div className="h-9 w-16 mx-auto rounded bg-fd-muted animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold text-fd-foreground">
                    {maxDiscount}%+
                  </p>
                )}
                <p className="text-sm text-fd-muted-foreground">
                  Exclusive Discounts
                </p>
              </div>
              <div className="hidden h-8 w-px bg-fd-border sm:block" />
              <div className="text-center">
                <p className="text-3xl font-bold text-fd-foreground">24/7</p>
                <p className="text-sm text-fd-muted-foreground">
                  Support Available
                </p>
              </div>
              <div className="hidden h-8 w-px bg-fd-border sm:block" />
              <div className="text-center">
                {loading ? (
                  <div className="h-9 w-8 mx-auto rounded bg-fd-muted animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold text-fd-foreground">
                    {providers.length}
                  </p>
                )}
                <p className="text-sm text-fd-muted-foreground">
                  Trusted Partners
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        {loading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-fd-border bg-fd-card p-6 sm:p-8"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="h-16 w-16 rounded-xl bg-fd-muted animate-pulse" />
                  <div className="flex-1 space-y-4">
                    <div className="h-7 w-48 rounded bg-fd-muted animate-pulse" />
                    <div className="h-4 w-full max-w-md rounded bg-fd-muted animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-fd-muted animate-pulse" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-8 w-24 rounded bg-fd-muted animate-pulse" />
                      <div className="h-8 w-24 rounded bg-fd-muted animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : providersWithTrust.length > 0 ? (
          <div className="space-y-8">
            {providersWithTrust.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fd-muted">
              <Handshake className="h-8 w-8 text-fd-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-fd-foreground mb-2">
              No Partners Yet
            </h3>
            <p className="text-fd-muted-foreground max-w-md mx-auto">
              We&apos;re actively looking for hosting partners.{" "}
              <Link
                href="https://github.com/CodeMeAPixel/FixFX/tree/develop/packages/providers"
                className="text-fd-primary hover:underline"
              >
                Learn how to become a partner
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* Why Partner Section */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-fd-foreground sm:text-3xl">
            Why Use Our Partner Links?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-fd-border bg-fd-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <Percent className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mb-2 font-semibold text-fd-foreground">
                Exclusive Discounts
              </h3>
              <p className="text-sm text-fd-muted-foreground">
                Get special pricing not available anywhere else. Our partner
                codes provide ongoing savings for as long as you own your
                server.
              </p>
            </div>
            <div className="rounded-xl border border-fd-border bg-fd-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="mb-2 font-semibold text-fd-foreground">
                Vetted Providers
              </h3>
              <p className="text-sm text-fd-muted-foreground">
                We only partner with hosting providers we trust and have
                personally tested. Quality and reliability are our top
                priorities.
              </p>
            </div>
            <div className="rounded-xl border border-fd-border bg-fd-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                <Headphones className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mb-2 font-semibold text-fd-foreground">
                Support FixFX
              </h3>
              <p className="text-sm text-fd-muted-foreground">
                Using our partner links helps support the continued development
                of FixFX and keeps our documentation free for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-fd-border">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          {/* Bottom Text */}
          <div className="text-center">
            <p className="text-sm text-fd-muted-foreground">
              By using our partner links, you support FixFX while getting
              exclusive discounts. Thank you for your support!
            </p>
          </div>
        </div>
      </section>

      {/* Become a Partner Section */}
      <section className="border-t border-fd-border bg-gradient-to-br from-fd-card/50 to-fd-background">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-2xl border border-fd-border/50 bg-gradient-to-br from-fd-card/30 to-fd-background p-8 sm:p-12">
            <div className="mx-auto max-w-3xl">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-400">
                  <Handshake className="h-4 w-4" />
                  <span>Partnership Opportunity</span>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-fd-foreground sm:text-4xl">
                  Want to Partner with FixFX?
                </h2>
                <p className="text-lg text-fd-muted-foreground">
                  We&apos;re always looking for quality hosting providers who
                  want to offer exclusive benefits to our community.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="mb-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-fd-border/30 bg-fd-background/50 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                  <h3 className="mb-2 font-semibold text-fd-foreground">
                    Reach Active Community
                  </h3>
                  <p className="text-sm text-fd-muted-foreground">
                    Connect with thousands of FiveM and RedM server owners
                  </p>
                </div>
                <div className="rounded-lg border border-fd-border/30 bg-fd-background/50 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Shield className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="mb-2 font-semibold text-fd-foreground">
                    Build Trust
                  </h3>
                  <p className="text-sm text-fd-muted-foreground">
                    Showcase your reliability and commitment to quality
                  </p>
                </div>
                <div className="rounded-lg border border-fd-border/30 bg-fd-background/50 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <Percent className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="mb-2 font-semibold text-fd-foreground">
                    Tracked Attribution
                  </h3>
                  <p className="text-sm text-fd-muted-foreground">
                    Use affiliate links to track conversions and ROI
                  </p>
                </div>
              </div>

              {/* Guidelines Preview */}
              <div className="mb-10 rounded-lg border border-fd-border/30 bg-fd-background/30 p-6">
                <h3 className="mb-4 font-semibold text-fd-foreground">
                  Partnership Requirements
                </h3>
                <div className="space-y-2 text-sm text-fd-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    VPS and/or Dedicated server hosting support
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    FiveM and/or RedM server hosting support
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    99.6%+ uptime with responsive 24/7 support
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    Exclusive discount or special offer for FixFX users
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    Affiliate/referral links for tracking
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                <button
                  onClick={() => setGuidelinesOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-fd-primary px-6 py-3 font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Partnership Guidelines
                  <ExternalLink className="h-4 w-4" />
                </button>
                <Link
                  href="https://discord.gg/cYauqJfnNK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 font-medium text-fd-foreground transition-colors hover:bg-fd-muted"
                >
                  Ask on Discord
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>

              {/* Footer Note */}
              <p className="mt-8 text-center text-xs text-fd-muted-foreground">
                We review all partnership applications within 3-5 business days.
                FixFX reserves the right to accept or decline requests at our
                discretion.
              </p>
            </div>
          </div>
        </div>
      </section>

      <GuidelinesModal open={guidelinesOpen} onOpenChange={setGuidelinesOpen} />
    </main>
  );
}
