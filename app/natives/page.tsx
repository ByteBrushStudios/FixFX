'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { NativesSidebar } from '@ui/core/natives/natives-sidebar';
import { NativesContent } from '@ui/core/natives/natives-content';
import { NativesFilterSheet } from '@ui/core/natives/natives-filter-sheet';
import { MobileNativesHeader } from '@ui/core/natives/mobile-natives-header';
import { Search, X } from 'lucide-react';
import { Button } from '@ui/components/button';
import { MobileNavigation } from '@ui/core/common/mobile-navigation';
import { useFetch } from '@core/useFetch';
import { Input } from '@ui/components/input';

export default function NativesPage() {
  // State with proper defaults and type enforcement
  const [game, setGame] = useState<'gta5' | 'rdr3'>('gta5');
  const [environment, setEnvironment] = useState<'all' | 'client' | 'server'>('all');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [includeCFX, setIncludeCFX] = useState(true);

  // Add missing mobile state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch metadata with proper dependencies
  const { data: metaData, isPending: isMetaDataLoading } = useFetch<{
    metadata: {
      namespaces: string[],
      namespacesByGameAndEnv: Record<string, Record<string, string[]>>,
      hasCfxNamespace: boolean
    }
  }>(
    `/api/natives?game=${game}&limit=1&cfx=${includeCFX}&full=true`,
    {},
    [game, includeCFX]
  );

  // Extract categories from metadata
  const categories = metaData?.metadata.namespaces || [];
  const categoriesByGameAndEnv = metaData?.metadata.namespacesByGameAndEnv;

  // Enhanced handlers with proper state updates
  const handleGameChange = useCallback((newGame: 'gta5' | 'rdr3') => {
    console.log(`Changing game from ${game} to ${newGame}`);
    setGame(newGame);
    // Reset category if not available in new game
    if (metaData?.metadata.namespacesByGameAndEnv?.[newGame]?.[environment]?.includes(category) === false) {
      setCategory('');
    }
  }, [game, environment, category, metaData]);

  const handleEnvironmentChange = useCallback((newEnv: 'all' | 'client' | 'server') => {
    console.log(`Changing environment from ${environment} to ${newEnv}`);
    setEnvironment(newEnv);
    // Reset category if not available in new environment
    if (metaData?.metadata.namespacesByGameAndEnv?.[game]?.[newEnv]?.includes(category) === false) {
      setCategory('');
    }
  }, [game, environment, category, metaData]);

  const handleSearchSubmit = useCallback((query: string) => {
    setSearchQuery(query);
    setSearchInputValue(query);

    // Update URL with search parameters
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('search', query);
    } else {
      url.searchParams.delete('search');
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

  // Parse URL params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const gameParam = params.get('game');
    const envParam = params.get('env');
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    const cfxParam = params.get('cfx');

    if (gameParam === 'gta5' || gameParam === 'rdr3') setGame(gameParam);
    if (envParam === 'all' || envParam === 'client' || envParam === 'server') setEnvironment(envParam);
    if (categoryParam) setCategory(categoryParam);
    if (searchParam) {
      setSearchQuery(searchParam);
      setSearchInputValue(searchParam);
    }
    if (cfxParam === 'false') setIncludeCFX(false);
  }, []);

  // Sync URL with state changes
  useEffect(() => {
    const url = new URL(window.location.href);

    if (game !== 'gta5') url.searchParams.set('game', game);
    else url.searchParams.delete('game');

    if (environment !== 'all') url.searchParams.set('env', environment);
    else url.searchParams.delete('env');

    if (category) url.searchParams.set('category', category);
    else url.searchParams.delete('category');

    if (!includeCFX) url.searchParams.set('cfx', 'false');
    else url.searchParams.delete('cfx');

    window.history.replaceState({}, '', url.toString());
  }, [game, environment, category, includeCFX]);

  // Clean up any pending timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
    }
  }, []);

  // Function to reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSearchInputValue('');
    setCategory('');
    setEnvironment('all');
    setGame('gta5');
    setIncludeCFX(true);
  };

  // Add missing category handler
  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory);
  }, []);

  // Add missing CFX toggle handler
  const handleToggleCFX = useCallback(() => {
    setIncludeCFX(!includeCFX);
  }, [includeCFX]);

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
        <NativesSidebar
          game={game}
          onGameChange={handleGameChange}
          environment={environment}
          onEnvironmentChange={handleEnvironmentChange}
          categories={categories}
          categoriesByGameAndEnv={categoriesByGameAndEnv}
          category={category}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchInputValue}
          onSearchQueryChange={handleSearchSubmit}
          includeCFX={includeCFX}
          onToggleCFX={handleToggleCFX}
        />
        <main className="flex-1 h-full flex flex-col">
          <NativesContent
            game={game}
            environment={environment}
            category={category}
            searchQuery={searchQuery}
            includeCFX={includeCFX}
          />
        </main>
      </div>

      {/* Mobile layout - Updated with new mobile header */}
      <div className="flex flex-col w-full h-full md:hidden">
        <MobileNativesHeader
          onMenuClick={() => setMobileNavOpen(true)}
          onSearchClick={() => setMobileSearchOpen(true)}
          onFilterClick={() => setFilterSheetOpen(true)}
          game={game}
          environment={environment}
          searchActive={mobileSearchOpen}
        />

        {/* Mobile search input - conditionally rendered */}
        {mobileSearchOpen && (
          <div className="fixed top-0 left-0 right-0 z-[150] bg-fd-background/95 backdrop-blur-md border-b border-[#5865F2]/20 p-3 flex flex-row items-center gap-2">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit(searchInputValue);
              setMobileSearchOpen(false);
            }} className="flex items-center flex-1 gap-2">
              <Input
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                placeholder="Search natives..."
                className="w-full h-9 bg-fd-background/60"
                autoFocus
              />
              <Button type="submit" size="icon" variant="default" className="h-9 w-9 rounded-md">
                <Search className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-md"
                onClick={() => {
                  setMobileSearchOpen(false);
                  if (searchQuery) {
                    setSearchInputValue('');
                    handleSearchSubmit('');
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Dropdown */}
        <MobileNavigation
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          currentPath="/natives"
        />

        {/* Filter Sheet for mobile */}
        <NativesFilterSheet
          isOpen={filterSheetOpen}
          onClose={() => setFilterSheetOpen(false)}
          game={game}
          onGameChange={(newGame) => {
            handleGameChange(newGame);
          }}
          environment={environment}
          onEnvironmentChange={(newEnv) => {
            handleEnvironmentChange(newEnv);
          }}
          categories={categories}
          categoriesByGameAndEnv={categoriesByGameAndEnv}
          category={category}
          onCategoryChange={(newCat) => {
            handleCategoryChange(newCat);
            setFilterSheetOpen(false);
          }}
          includeCFX={includeCFX}
          onToggleCFX={handleToggleCFX}
        />

        <main className="flex-1 h-full flex flex-col mt-16">
          <NativesContent
            game={game}
            environment={environment}
            category={category}
            searchQuery={searchQuery}
            includeCFX={includeCFX}
          />
        </main>
      </div>
    </div>
  );
}