import { blogPosts } from "@/../source.config";
import { DOCS_URL } from "@utils/index";

export async function GET() {
  const posts = blogPosts.getPages();
  
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "FixFX Blog",
    home_page_url: DOCS_URL,
    feed_url: `${DOCS_URL}/blog/feed.json`,
    description: "News, tutorials, and updates for the FiveM, RedM, and CitizenFX community",
    icon: `${DOCS_URL}/android-chrome-512x512.png`,
    favicon: `${DOCS_URL}/favicon-32x32.png`,
    authors: [
      {
        name: "FixFX Team",
        url: "https://github.com/CodeMeAPixel",
      },
    ],
    language: "en-US",
    items: posts
      .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
      .map((post) => ({
        id: `${DOCS_URL}/blog/${post.slugs.join("/")}`,
        url: `${DOCS_URL}/blog/${post.slugs.join("/")}`,
        title: post.data.title,
        summary: post.data.description || "",
        date_published: new Date(post.data.date).toISOString(),
        authors: [{ name: post.data.author }],
      })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
