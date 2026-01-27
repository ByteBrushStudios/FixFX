"use client";

import * as React from "react";
import { Menu, Search, SlidersHorizontal, Code } from "lucide-react";
import { Button } from "@ui/components/button";
import { Badge } from "@ui/components/badge";
import { cn } from "@utils/functions/cn";
import { motion } from "motion/react";

interface MobileNativesHeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  onFilterClick: () => void;
  game: "gta5" | "rdr3";
  environment: "all" | "client" | "server";
  searchActive?: boolean;
}

export function MobileNativesHeader({
  onMenuClick,
  onSearchClick,
  onFilterClick,
  game,
  environment,
  searchActive = false,
}: MobileNativesHeaderProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-3 border-b bg-fd-background/95 backdrop-blur-xl border-[#5865F2]/10 z-[100]"
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-9 w-9 hover:bg-[#5865F2]/10"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#5865F2]/20 to-[#5865F2]/5">
            <Code className="h-4 w-4 text-[#5865F2]" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold">Natives</h2>
            <div className="flex items-center gap-1">
              <Badge
                variant="secondary"
                className="h-4 px-1.5 text-[10px] bg-[#5865F2]/10 text-[#5865F2] border-none"
              >
                {game === "gta5" ? "GTA V" : "RDR3"}
              </Badge>
              <Badge
                variant="secondary"
                className={cn(
                  "h-4 px-1.5 text-[10px] border-none",
                  environment === "client" && "bg-blue-500/10 text-blue-400",
                  environment === "server" && "bg-green-500/10 text-green-400",
                  environment === "all" && "bg-purple-500/10 text-purple-400",
                )}
              >
                {environment === "all"
                  ? "All"
                  : environment === "client"
                    ? "Client"
                    : "Server"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      {!searchActive && (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#5865F2]/5 border-[#5865F2]/10 hover:bg-[#5865F2]/10 hover:border-[#5865F2]/20 h-8 gap-1.5 rounded-lg transition-all duration-200"
            onClick={onFilterClick}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#5865F2]" />
            <span className="text-xs">Filters</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-[#5865F2]/10"
            onClick={onSearchClick}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
