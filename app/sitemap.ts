import { source, blog } from "@/lib/docs/source";
import { DOCS_URL } from "@utils/index";
import type { MetadataRoute } from "next";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, DOCS_URL).toString();
  const now = new Date();

  // Get all documentation pages
  const docPages = await Promise.all(
    source.getPages().map(async (page) => {
      const { lastModified } = page.data;
      return {
        url: url(page.url),
        lastModified: lastModified ? new Date(lastModified) : now,
        changeFrequency: "weekly",
        priority: 0.6,
      } as MetadataRoute.Sitemap[number];
    }),
  );

  // Get all blog posts
  const blogPages = await Promise.all(
    blog.getPages().map(async (page) => {
      const { lastModified } = page.data;
      return {
        url: url(page.url),
        lastModified: lastModified ? new Date(lastModified) : now,
        changeFrequency: "monthly",
        priority: 0.7,
      } as MetadataRoute.Sitemap[number];
    }),
  );

  return [
    // Main pages - highest priority
    {
      url: url("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Tools and features - high priority
    {
      url: url("/artifacts"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: url("/natives"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    // Documentation sections - high priority
    {
      url: url("/docs/core"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: url("/docs/cfx"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: url("/docs/txadmin"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: url("/docs/frameworks"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: url("/docs/vmenu"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: url("/docs/guides"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // Blog section
    {
      url: url("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // AI Assistant
    {
      url: url("/chat"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Hosting Partners
    {
      url: url("/hosting"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    // All documentation pages
    ...docPages,
    // All blog posts
    ...blogPages,
  ];
}
