"use client";

import { Button } from "@ui/components";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { SearchBar } from "./search";

export function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center mb-16 md:mb-24 px-4">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px] animate-pulse" />
      <div className="absolute -top-10 right-1/4 h-64 w-64 rounded-full bg-purple-500/15 blur-[80px] animate-pulse delay-1000" />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-500 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Open Source Documentation
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-fd-foreground mb-4 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Fix
            </span>
            <span className="absolute -inset-1 -z-10 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 blur-2xl" />
          </span>
          <span className="ml-1 md:ml-2">FX</span>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-fd-muted-foreground mb-8 max-w-xl text-center text-base sm:text-lg md:text-xl leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        Your comprehensive resource for{" "}
        <span className="text-fd-foreground font-medium">FiveM</span>,{" "}
        <span className="text-fd-foreground font-medium">RedM</span>, and the{" "}
        <span className="text-fd-foreground font-medium">CitizenFX</span>{" "}
        ecosystem.
      </motion.p>

      {/* Search bar */}
      <motion.div
        className="w-full max-w-lg mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <SearchBar />
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        className="flex flex-col gap-3 sm:flex-row sm:gap-4 w-full sm:w-auto mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        <Link href="/docs/core" className="w-full sm:w-auto">
          <Button
            className="group relative overflow-hidden w-full sm:w-auto"
            variant="default"
            size="lg"
          >
            <span className="relative z-10 flex items-center justify-center">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </Link>
        <Link href="/docs/cfx/common-errors" className="w-full sm:w-auto">
          <Button
            className="group w-full sm:w-auto"
            variant="outline"
            size="lg"
          >
            <span className="relative z-10 flex items-center justify-center">
              Troubleshoot Issues
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </Link>
      </motion.div>

      {/* Stats/Trust indicators */}
      <motion.div
        className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-fd-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>Free & Open Source</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Community Driven</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <span>Always Updated</span>
        </div>
      </motion.div>
    </div>
  );
}
