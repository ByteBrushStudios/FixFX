"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, BookOpen, Boxes, Wrench, Database } from "lucide-react";

const docSections = [
  {
    title: "Getting Started",
    description:
      "Step-by-step guides for setting up your FiveM or RedM server from scratch.",
    href: "/docs/core",
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Framework Guides",
    description:
      "Documentation for ESX, QBCore, vRP, and other popular frameworks.",
    href: "/docs/frameworks",
    icon: Boxes,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Troubleshooting",
    description:
      "Fix common errors and crashes for servers and clients quickly.",
    href: "/docs/cfx/common-errors",
    icon: Wrench,
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Database Setup",
    description:
      "Configure MySQL, MariaDB, and other databases for your server.",
    href: "/docs/guides/database-setup",
    icon: Database,
    gradient: "from-green-500 to-emerald-500",
  },
];

export function DocsPreview() {
  return (
    <section className="w-full max-w-5xl mx-auto py-16 md:py-24 px-4">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 md:mb-14"
      >
        <span className="text-blue-500 font-medium text-sm uppercase tracking-wider">
          Documentation
        </span>
        <h2 className="text-fd-foreground mt-3 text-3xl md:text-4xl font-bold">
          Explore Our Guides
        </h2>
        <p className="text-fd-muted-foreground mt-4 max-w-lg mx-auto text-base md:text-lg">
          From server setup to advanced scripting, find the answers you need.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {docSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Link href={section.href} className="group block h-full">
              <div className="relative h-full overflow-hidden rounded-2xl border border-fd-border bg-fd-background/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-fd-border/80 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20">
                {/* Gradient accent */}
                <div
                  className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${section.gradient} opacity-10 blur-3xl transition-opacity duration-300 group-hover:opacity-20`}
                />

                {/* Icon */}
                <div
                  className={`relative inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${section.gradient} p-3 text-white shadow-lg`}
                >
                  <section.icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <h3 className="text-fd-foreground mt-5 text-xl font-semibold">
                  {section.title}
                </h3>
                <p className="text-fd-muted-foreground mt-2 text-sm leading-relaxed">
                  {section.description}
                </p>

                {/* Link indicator */}
                <div className="mt-4 flex items-center text-sm font-medium text-blue-500 transition-colors group-hover:text-blue-400">
                  <span>Read more</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
