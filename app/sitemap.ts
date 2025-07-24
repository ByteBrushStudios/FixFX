import { source } from "@/lib/docs/source";
import { DOCS_URL } from "@utils/index";
import type { MetadataRoute } from "next";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, DOCS_URL).toString();

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: url("/docs/core"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: url("/docs/cfx"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: url("/docs/txadmin"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: url("/blog"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...(await Promise.all(
      source.getPages().map(async (page) => {
        const { lastModified } = page.data;

        return {
          url: url(page.url),
          lastModified: lastModified ? new Date(lastModified) : undefined,
          changeFrequency: "weekly",
          priority: 0.5,
        } as MetadataRoute.Sitemap[number];
      }),
    )),
  ];
}
