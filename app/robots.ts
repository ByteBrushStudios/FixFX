import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/docs/core", "/docs/cfx", "/blog"],
    },
    sitemap: "https://fixfx.wiki",
  };
}
