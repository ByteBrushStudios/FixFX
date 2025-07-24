"use client"

import { Button } from "@ui/components/button";
import Link from "next/link";
import { cn } from "@utils/functions/cn";
import { useEffect, useRef } from "react";
import { NAV_LINKS } from "@utils/constants/link";

interface MobileNavigationProps {
    isOpen: boolean;
    onClose: () => void;
    currentPath: string;
}

export function MobileNavigation({ isOpen, onClose, currentPath }: MobileNavigationProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        // Add a slight delay to avoid immediate closure
        setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "absolute left-0 right-0 z-20 border-b border-[#5865F2]/20 bg-fd-background/95 backdrop-blur-md shadow-lg transition-all duration-300 overflow-hidden",
                isOpen ? "top-[56px] opacity-100" : "top-[56px] opacity-0 pointer-events-none"
            )}
        >
            <div className="py-2">
                {NAV_LINKS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.href}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start px-6 py-5 text-base",
                                currentPath === item.href && "bg-[#5865F2]/20 text-[#5865F2]"
                            )}
                            asChild
                            onClick={onClose}
                        >
                            {item.external ? (
                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                    <Icon className="h-4 w-4 mr-3" />
                                    {item.name}
                                </a>
                            ) : (
                                <Link href={item.href} className="flex items-center">
                                    <Icon className="h-4 w-4 mr-3" />
                                    {item.name}
                                </Link>
                            )}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
