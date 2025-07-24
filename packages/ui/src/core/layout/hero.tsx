"use client";

import { Button } from "@ui/components";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { SearchBar } from "./search";

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center mb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-fd-foreground mb-4 text-center text-4xl font-extrabold md:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent">Fix</span>
          <span className="ml-2">Fx</span>
        </h1>
      </motion.div>
      
      <motion.p 
        className="text-fd-muted-foreground mb-8 max-w-2xl text-center text-lg md:text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Your one-stop resource for FiveM, RedM, and CitizenFX. From server setup to troubleshooting, we've got you covered.
      </motion.p>
      
      <motion.div 
        className="w-full max-w-md mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <SearchBar />
      </motion.div>
      
      <motion.div 
        className="flex flex-col gap-4 sm:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Link href="/docs/cfx">
          <Button className="px-6 py-3" variant="default">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/docs/cfx/common-errors">
          <Button className="px-6 py-3" variant="secondary">
            Resolve Issues <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
