"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const docSections = [
  {
    title: "Getting Started",
    description: "Step-by-step guides for setting up your FiveM or RedM server.",
    href: "/docs/getting-started",
    icon: "🚀",
  },
  {
    title: "Framework Guides",
    description: "Documentation for ESX, QBCore, vRP, and other frameworks.",
    href: "/docs/frameworks",
    icon: "📦",
  },
  {
    title: "Troubleshooting",
    description: "Fix common errors and crashes for servers and clients.",
    href: "/docs/troubleshooting",
    icon: "🔧",
  },
  {
    title: "Server Artifacts",
    description: "Learn how to update and manage your server artifacts.",
    href: "/docs/server-artifacts",
    icon: "🛠️",
  },
];

export function DocsPreview() {
  return (
    <section className="my-16">
      <div className="text-center mb-10">
        <h2 className="text-fd-muted-foreground select-none text-xl font-medium uppercase">
          Explore Documentation
        </h2>
        <h3 className="text-fd-foreground my-1 text-wrap text-3xl font-semibold">
          Everything You Need to Know
        </h3>
        <p className="text-fd-muted-foreground mt-1.5 max-w-lg mx-auto text-pretty text-xl italic">
          From server setup to advanced scripting, find the answers here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {docSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              href={section.href}
              className="bg-fd-background border-fd-border hover:border-blue-500 flex flex-col h-full rounded-xl border p-6 transition-colors"
            >
              <div className="text-4xl mb-4">{section.icon}</div>
              <h4 className="text-fd-foreground text-xl font-semibold mb-2">{section.title}</h4>
              <p className="text-fd-muted-foreground flex-grow mb-4">{section.description}</p>
              <div className="text-blue-500 flex items-center font-medium">
                Read more <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
