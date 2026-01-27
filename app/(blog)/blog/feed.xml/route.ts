import { blogPosts } from "@/../source.config";
import { DOCS_URL } from "@utils/index";

export async function GET() {
  const posts = blogPosts.getPages();
  
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>FixFX Blog</title>
    <link>${DOCS_URL}</link>
    <description>News, tutorials, and updates for the FiveM, RedM, and CitizenFX community</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${DOCS_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${DOCS_URL}/logo.png</url>
      <title>FixFX Blog</title>
      <link>${DOCS_URL}</link>
    </image>
    ${posts
      .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${DOCS_URL}/blog/${post.slugs.join("/")}</link>
      <guid isPermaLink="true">${DOCS_URL}/blog/${post.slugs.join("/")}</guid>
      <description><![CDATA[${post.data.description || ""}]]></description>
      <author>${post.data.author}</author>
      <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
