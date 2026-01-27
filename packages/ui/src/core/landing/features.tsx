"use client";

import { BorderBeam } from "@ui/components";
import {
  Code,
  Server,
  Database,
  Globe,
  Bug,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const features = [
  {
    icon: Server,
    title: "Server Management",
    description:
      "Setup, maintenance, and optimization guides for FiveM and RedM server owners.",
    href: "/docs/guides/server-configuration",
    color: "blue",
  },
  {
    icon: Code,
    title: "Resource Development",
    description:
      "Lua, JavaScript and C# tutorials for creating custom CitizenFX resources.",
    href: "/docs/cfx/resource-development",
    color: "purple",
  },
  {
    icon: Database,
    title: "Database Integration",
    description:
      "MySQL, MongoDB and framework integration solutions for server data persistence.",
    href: "/docs/guides/database-setup",
    color: "green",
  },
  {
    icon: Bug,
    title: "Error Solutions",
    description:
      "Fixes for artifacts, client crashes, server errors, and networking issues.",
    href: "/docs/cfx/common-errors",
    color: "red",
  },
  {
    icon: Globe,
    title: "Multiplayer Frameworks",
    description:
      "ESX, QBCore, vRP, and other popular FiveM/RedM framework documentation.",
    href: "/docs/frameworks",
    color: "cyan",
  },
  {
    icon: Users,
    title: "Player Guides",
    description:
      "Installation help, mod management, and troubleshooting for players.",
    href: "/docs/cfx/faq",
    color: "orange",
  },
];

const colorVariants = {
  blue: "group-hover:text-blue-500 group-hover:bg-blue-500/10",
  purple: "group-hover:text-purple-500 group-hover:bg-purple-500/10",
  green: "group-hover:text-green-500 group-hover:bg-green-500/10",
  red: "group-hover:text-red-500 group-hover:bg-red-500/10",
  cyan: "group-hover:text-cyan-500 group-hover:bg-cyan-500/10",
  orange: "group-hover:text-orange-500 group-hover:bg-orange-500/10",
};

const borderColorVariants = {
  blue: "hover:border-blue-500/50",
  purple: "hover:border-purple-500/50",
  green: "hover:border-green-500/50",
  red: "hover:border-red-500/50",
  cyan: "hover:border-cyan-500/50",
  orange: "hover:border-orange-500/50",
};

export function Features() {
  return (
    <section className="w-full max-w-6xl mx-auto py-16 md:py-24 px-4">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 md:mb-16"
      >
        <span className="text-blue-500 font-medium text-sm uppercase tracking-wider">
          Everything You Need
        </span>
        <h2 className="text-fd-foreground mt-3 text-3xl md:text-4xl font-bold">
          FiveM & RedM Solutions
        </h2>
        <p className="text-fd-muted-foreground mt-4 max-w-2xl mx-auto text-base md:text-lg">
          Comprehensive guides for server owners, developers, and players in the
          CitizenFX ecosystem.
        </p>
      </motion.div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={feature.href}>
              <div
                className={`group relative h-full rounded-2xl border border-fd-border bg-fd-background/50 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 ${borderColorVariants[feature.color as keyof typeof borderColorVariants]}`}
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center rounded-xl p-3 bg-fd-muted/50 text-fd-muted-foreground transition-all duration-300 ${colorVariants[feature.color as keyof typeof colorVariants]}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="text-fd-foreground mt-4 text-lg font-semibold flex items-center gap-2">
                  {feature.title}
                  <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                </h3>
                <p className="text-fd-muted-foreground mt-2 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
