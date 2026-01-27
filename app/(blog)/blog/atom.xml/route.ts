import { blogPosts } from "@/../source.config";
import { DOCS_URL } from "@utils/index";

export async function GET() {
  const posts = blogPosts.getPages();
  
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>FixFX Blog</title>
  <subtitle>News, tutorials, and updates for the FiveM, RedM, and CitizenFX community</subtitle>
  <link href="${DOCS_URL}/blog/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${DOCS_URL}" rel="alternate" type="text/html"/>
  <id>${DOCS_URL}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>FixFX Team</name>
    <uri>https://github.com/CodeMeAPixel</uri>
  </author>
  <icon>${DOCS_URL}/favicon-32x32.png</icon>
  <logo>${DOCS_URL}/logo.png</logo>
  <rights>© ${new Date().getFullYear()} FixFX. All rights reserved.</rights>
  ${posts
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map(
      (post) => `
  <entry>
    <title><![CDATA[${post.data.title}]]></title>
    <link href="${DOCS_URL}/blog/${post.slugs.join("/")}" rel="alternate" type="text/html"/>
    <id>${DOCS_URL}/blog/${post.slugs.join("/")}</id>
    <published>${new Date(post.data.date).toISOString()}</published>
    <updated>${new Date(post.data.date).toISOString()}</updated>
    <author>
      <name>${post.data.author}</name>
    </author>
    <summary type="html"><![CDATA[${post.data.description || ""}]]></summary>
  </entry>`
    )
    .join("")}
</feed>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
