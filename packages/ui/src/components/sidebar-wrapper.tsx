'use client';

import { FaSearch } from 'react-icons/fa';
import { Menu, X, Search, Gamepad2, Monitor, Server, Code } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@ui/components/button';
import { ScrollArea } from '@ui/components/scroll-area';
import { cn } from '@utils/functions/cn';
import { FixFXIcon } from '../icons';
import { NAV_LINKS } from '@utils/constants/link';
import Link from 'next/link';

interface SidebarWrapperProps {
  children: React.ReactNode;
  selectedGame: 'gta5' | 'rdr3';
  onGameChange: (game: 'gta5' | 'rdr3') => void;
  selectedEnvironment: 'all' | 'client' | 'server';
  onEnvironmentChange: (env: 'all' | 'client' | 'server') => void;
  categories?: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SidebarWrapper({
  children,
  selectedGame,
  onGameChange,
  selectedEnvironment,
  onEnvironmentChange,
  categories = [],
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearch,
}: SidebarWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full bg-background relative overflow-hidden min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,101,242,0.1),rgba(255,255,255,0))]" />
        <div className="absolute left-0 top-0 h-32 w-32 animate-pulse rounded-full bg-[#5865F2]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-32 w-32 animate-pulse rounded-full bg-[#5865F2]/20 blur-3xl" />
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />

      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-fd-background/80 backdrop-blur-md px-4">
          <h2 className="text-lg font-semibold flex items-center">
            <FixFXIcon className="h-6 w-6 mr-2" />
            Natives Explorer
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
            >
              {/* Menu icon for site navigation */}
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSidebarToggle}
            >
              {/* Icon for filter sidebar */}
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
          </div>

          {/* Site Navigation Dropdown */}
          {isNavMenuOpen && (
            <div className="absolute top-16 right-0 z-50 w-48 bg-fd-background/95 backdrop-blur-md shadow-lg border border-[#5865F2]/20 rounded-bl-lg">
              <div className="py-1">
                {NAV_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                      onClick={() => setIsNavMenuOpen(false)}
                    >
                      {item.external ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2">
                          <Icon className="h-4 w-4 mr-2 text-[#5865F2]" />
                          {item.name}
                        </a>
                      ) : (
                        <Link href={item.href} className="flex items-center px-4 py-2">
                          <Icon className="h-4 w-4 mr-2 text-[#5865F2]" />
                          {item.name}
                        </Link>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay for mobile - moved before sidebar for proper z-index layering */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={handleSidebarToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "shrink-0 border-r bg-fd-background/80 backdrop-blur-sm transition-all duration-300 ease-in-out",
          isMobile
            ? "fixed left-0 top-0 bottom-0 z-50 h-full pt-16" // Added pt-16 to account for header
            : "sticky top-0 left-0 h-screen z-40",
          !isMobile && !isSidebarOpen ? "w-16" : "w-80",
          isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex h-16 items-center justify-between border-b px-4">
              {isSidebarOpen &&
                <h2 className="text-lg font-semibold flex items-center">
                  <FixFXIcon className="h-6 w-6 mr-2" />
                  Natives Explorer
                </h2>}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSidebarToggle}
                className={!isSidebarOpen ? "mx-auto" : ""}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          )}

          {/* Sidebar Content */}
          {isSidebarOpen ? (
            <>
              <div className="border-b p-4">
                <div className="flex w-full items-center rounded-md border border-input backdrop-blur-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <div className="flex items-center justify-center px-3 py-2 border-r border-border text-muted-foreground">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search natives..."
                    className="w-full bg-transparent py-2 px-3 text-sm placeholder:text-muted-foreground focus:outline-none"
                    value={searchQuery}
                    onChange={onSearch}
                  />
                </div>
              </div>

              <ScrollArea className="flex-1 h-full">
                <div className="space-y-6 p-4">
                  {/* Game Selection */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Game</h3>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedGame === 'gta5' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "flex-1",
                          selectedGame === 'gta5' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                        )}
                        onClick={() => {
                          onGameChange('gta5');
                          isMobile && setIsSidebarOpen(false);
                        }}
                      >
                        <Gamepad2 className="mr-2 h-4 w-4" />
                        GTA V
                      </Button>
                      <Button
                        variant={selectedGame === 'rdr3' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "flex-1",
                          selectedGame === 'rdr3' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                        )}
                        onClick={() => {
                          onGameChange('rdr3');
                          isMobile && setIsSidebarOpen(false);
                        }}
                      >
                        <Gamepad2 className="mr-2 h-4 w-4" />
                        RDR3
                      </Button>
                    </div>
                  </div>

                  {/* Environment Selection */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Environment</h3>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedEnvironment === 'all' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "flex-1",
                          selectedEnvironment === 'all' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                        )}
                        onClick={() => {
                          onEnvironmentChange('all');
                          isMobile && setIsSidebarOpen(false);
                        }}
                      >
                        <Server className="mr-2 h-4 w-4" />
                        All
                      </Button>
                      <Button
                        variant={selectedEnvironment === 'client' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "flex-1",
                          selectedEnvironment === 'client' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                        )}
                        onClick={() => {
                          onEnvironmentChange('client');
                          isMobile && setIsSidebarOpen(false);
                        }}
                      >
                        <Monitor className="mr-2 h-4 w-4" />
                        Client
                      </Button>
                      <Button
                        variant={selectedEnvironment === 'server' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "flex-1",
                          selectedEnvironment === 'server' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                        )}
                        onClick={() => {
                          onEnvironmentChange('server');
                          isMobile && setIsSidebarOpen(false);
                        }}
                      >
                        <Server className="mr-2 h-4 w-4" />
                        Server
                      </Button>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant={selectedCategory === '' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "justify-start",
                          selectedCategory === '' && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                        )}
                        onClick={() => {
                          onCategoryChange('');
                          isMobile && setIsSidebarOpen(false);
                        }}
                      >
                        <Code className="mr-2 h-4 w-4" />
                        All Categories
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? 'default' : 'outline'}
                          size="sm"
                          className={cn(
                            "justify-start",
                            selectedCategory === category && "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none"
                          )}
                          onClick={() => {
                            onCategoryChange(category);
                            isMobile && setIsSidebarOpen(false);
                          }}
                        >
                          <Code className="mr-2 h-4 w-4" />
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            // Icon-only sidebar when collapsed
            !isMobile && (
              <div className="py-4 flex flex-col items-center space-y-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onGameChange('gta5')}
                  className={selectedGame === 'gta5' ? 'bg-[#5865F2] text-white hover:bg-[#5865F2]/90' : ''}
                >
                  <Gamepad2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onGameChange('rdr3')}
                  className={selectedGame === 'rdr3' ? 'bg-[#5865F2] text-white hover:bg-[#5865F2]/90' : ''}
                >
                  <Gamepad2 className="h-5 w-5" />
                </Button>
                <div className="w-8 border-t border-border my-2"></div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEnvironmentChange('all')}
                  className={selectedEnvironment === 'all' ? 'bg-[#5865F2] text-white hover:bg-[#5865F2]/90' : ''}
                >
                  <Server className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEnvironmentChange('client')}
                  className={selectedEnvironment === 'client' ? 'bg-[#5865F2] text-white hover:bg-[#5865F2]/90' : ''}
                >
                  <Monitor className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEnvironmentChange('server')}
                  className={selectedEnvironment === 'server' ? 'bg-[#5865F2] text-white hover:bg-[#5865F2]/90' : ''}
                >
                  <Server className="h-5 w-5" />
                </Button>
              </div>
            )
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto relative z-10",
        isMobile && "pt-16"
      )}>
        <div className="container mx-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
