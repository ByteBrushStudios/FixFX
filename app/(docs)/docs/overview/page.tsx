import { Card, CardHeader, CardTitle, CardDescription } from "@ui/components/card";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { LucideBook, Wrench, Terminal, Package, Settings, Code, Info } from "lucide-react";
import { DISCORD_LINK, GITHUB_LINK } from "@/packages/utils/src";
import Link from "next/link";

const sections = [
  {
    title: "Getting Started",
    description: "Learn the basics of FixFX and CitizenFX development.",
    icon: <LucideBook className="h-6 w-6" />,
    href: "/docs/core",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    title: "CitizenFX Platform",
    description: "Understand the CitizenFX platform and its components.",
    icon: <Terminal className="h-6 w-6" />,
    href: "/docs/cfx",
    color: "bg-orange-500/10 text-orange-500"
  },
  {
    title: "Common Tools",
    description: "Essential tools for FiveM server development and management.",
    icon: <Wrench className="h-6 w-6" />,
    href: "/docs/cfx/common-tools",
    color: "bg-green-500/10 text-green-500"
  },
  {
    title: "Error Guides",
    description: "Solutions for common errors and troubleshooting guides.",
    icon: <Info className="h-6 w-6" />,
    href: "/docs/cfx/common-errors",
    color: "bg-red-500/10 text-red-500"
  },
  {
    title: "Best Practices",
    description: "Learn recommended practices for development and server management.",
    icon: <Settings className="h-6 w-6" />,
    href: "/docs/cfx/best-practices",
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    title: "Resource Development",
    description: "Guides for developing FiveM resources and scripts.",
    icon: <Code className="h-6 w-6" />,
    href: "/docs/cfx/resource-development",
    color: "bg-yellow-500/10 text-yellow-500"
  }
];

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter">Documentation</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive documentation covering everything from basic concepts to advanced development techniques.
          </p>
        </div>

        {/* Documentation sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link key={section.title} href={section.href}>
              <Card className="transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className={`w-fit p-2 rounded-lg ${section.color} mb-4`}>
                    {section.icon}
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Community links */}
        <div className="flex flex-col items-center space-y-4 mt-12">
          <h2 className="text-2xl font-bold">Join Our Community</h2>
          <div className="flex gap-4">
            <Link
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <FaDiscord className="h-5 w-5" />
              <span>Discord</span>
            </Link>
            <Link
              href={GITHUB_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <FaGithub className="h-5 w-5" />
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
