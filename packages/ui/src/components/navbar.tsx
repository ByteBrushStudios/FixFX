"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Home, Terminal, Code, Folder, Github, Book } from "lucide-react";
import { GITHUB_ORG, DISCORD_LINK } from "@utils/constants";
import { Button } from "./button";
import { cn } from "@utils/functions/cn";
import { FixFXIcon } from "../icons";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  active?: boolean;
}

interface NavigationProps {
  items?: NavItem[];
  activeHref?: string;
}

export function Navbar({ items, activeHref }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Default navigation items
  const defaultNavItems: NavItem[] = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Artifacts', icon: Folder, href: '/artifacts' },
    { label: 'Natives', icon: Terminal, href: '/natives' },
    { label: 'Documentation', icon: Code, href: '/docs' },
    { label: "Blog", icon: Book, href: "/blog" },
  ];

  // Use provided items or default items
  const navItems = items || defaultNavItems.map(item => ({
    ...item,
    active: item.href === activeHref
  }));

  return (
    <>
      {/* Desktop & Mobile Navigation */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          isScrolled 
            ? "bg-fd-background/80 backdrop-blur-md border-b shadow-sm" 
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <FixFXIcon className="h-8 w-8" />
              <span className="font-bold text-lg">FixFX</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <a
                  href={GITHUB_ORG}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center"
                >
                  <Github className="mr-2 h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <a
                  href={DISCORD_LINK}
                  className="flex items-center"
                >
                  <span>Join Discord</span>
                </a>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden pt-16">
          <nav className="container mx-auto p-6 space-y-6">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center p-3 text-base font-medium rounded-lg transition-colors",
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t pt-6 space-y-4">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <a
                  href="https://github.com/toxic-development/fixfx.wiki"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center"
                >
                  <Github className="mr-2 h-5 w-5" />
                  <span>GitHub</span>
                </a>
              </Button>
              <Button asChild className="w-full justify-start">
                <a
                  href="/discord"
                  className="flex items-center"
                >
                  <span>Join Discord</span>
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
