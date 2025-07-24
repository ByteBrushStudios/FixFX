'use client';

import { useState, useEffect, Suspense } from 'react';
import { ArtifactsSidebar } from '@ui/core/artifacts/artifacts-sidebar';
import { ArtifactsContent } from '@ui/core/artifacts/artifacts-content';
import { MobileArtifactsHeader } from '@ui/core/artifacts/mobile-artifacts-header';
import { ArtifactsDrawer } from '@ui/core/artifacts/artifacts-drawer';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@ui/components/card';
import { Progress } from '@ui/components/progress';

type SupportStatus = "recommended" | "latest" | "active" | "deprecated" | "eol" | undefined;

// Create a wrapper component for handling search params
function ArtifactsPageContent() {
  const searchParams = useSearchParams();
  const initialPlatform = (searchParams.get('platform') as 'windows' | 'linux') || 'windows';
  const initialSearch = searchParams.get('search') || '';
  const initialSortBy = (searchParams.get('sortBy') as 'version' | 'date') || 'version';
  const initialSortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
  const initialStatus = (searchParams.get('status') as SupportStatus) || undefined;
  const initialIncludeEol = searchParams.get('includeEol') === 'true';

  // Set state with initial values from URL
  const [platform, setPlatform] = useState<'windows' | 'linux'>(initialPlatform);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'version' | 'date'>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
  const [status, setStatus] = useState<SupportStatus>(initialStatus);
  const [includeEol, setIncludeEol] = useState(initialIncludeEol);
  const [artifactsDrawerOpen, setArtifactsDrawerOpen] = useState(false);

  const router = useRouter();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('platform', platform);

    if (searchQuery) params.set('search', searchQuery);
    if (sortBy !== 'version') params.set('sortBy', sortBy);
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
    if (status) params.set('status', status);
    if (includeEol) params.set('includeEol', 'true');

    // Replace state without triggering a navigation
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', url);
  }, [platform, searchQuery, sortBy, sortOrder, status, includeEol]);

  // Handle platform change in the sidebar
  const handlePlatformChange = (newPlatform: 'windows' | 'linux') => {
    setPlatform(newPlatform);
  };

  return (
    <div className="relative flex min-h-screen h-screen bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,101,242,0.1),rgba(255,255,255,0))]" />
        <div className="absolute left-0 top-0 h-32 w-32 animate-pulse rounded-full bg-[#5865F2]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-32 w-32 animate-pulse rounded-full bg-[#5865F2]/20 blur-3xl" />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex w-full h-full">
        <ArtifactsSidebar
          platform={platform}
          onPlatformChange={setPlatform}
        />
        <main className="flex-1 h-full flex flex-col">
          <ArtifactsContent
            platform={platform}
            searchQuery={searchQuery}
            sortBy={sortBy}
            sortOrder={sortOrder}
            status={status}
            includeEol={includeEol}
          />
        </main>
      </div>

      {/* Mobile layout - with consistent header */}
      <div className="flex flex-col w-full h-full md:hidden">
        <MobileArtifactsHeader
          onMenuClick={() => setArtifactsDrawerOpen(true)}
          platform={platform}
        />

        {/* Mobile Navigation - Using updated artifacts drawer */}
        <ArtifactsDrawer
          isOpen={artifactsDrawerOpen}
          onClose={() => setArtifactsDrawerOpen(false)}
          platform={platform}
          onPlatformChange={handlePlatformChange}
        />

        <main className="flex-1 h-full w-full mt-16">
          <Suspense
            fallback={
              <Card className="p-8">
                <Progress value={undefined} className="w-full" />
                <p className="text-center mt-4 text-muted-foreground">Loading artifacts...</p>
              </Card>
            }
          >
            <ArtifactsContent
              platform={platform}
              searchQuery={searchQuery}
              sortBy={sortBy}
              sortOrder={sortOrder}
              status={status}
              includeEol={includeEol}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

// Export the main page component with Suspense
export default function ArtifactsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 w-full max-w-md mx-4">
            <Progress value={undefined} className="w-full" />
            <p className="text-center mt-4 text-muted-foreground">Loading artifacts page...</p>
          </Card>
        </div>
      }
    >
      <ArtifactsPageContent />
    </Suspense>
  );
}

// Mark as dynamic
export const dynamic = 'force-dynamic';
