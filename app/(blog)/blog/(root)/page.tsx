import { FixFXIcon } from "@ui/icons";
import { blog } from "@/lib/docs/source";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = blog.getPages();

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12 md:py-20">
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-fd-border bg-fd-card/50 backdrop-blur-sm">
          <FixFXIcon className="size-5" stroke="#8b5cf6" />
          <span className="text-sm font-medium text-fd-muted-foreground">
            Latest Articles
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-fd-foreground mb-4">
          FixFX Blog
        </h1>
        <p className="text-fd-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          News, guides, and insights from the FixFX community. Learn best
          practices, get updates, and discover new features.
        </p>
      </div>

      {/* Posts grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {posts.map((post, index) => (
          <Link
            key={post.url}
            href={post.url}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-fd-border bg-fd-card hover:bg-fd-card/80 transition-all duration-300 hover:border-fd-primary/50 hover:shadow-lg"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Gradient accent on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-fd-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex flex-col flex-1 p-6">
              {/* Meta info */}
              {post.data.date && (
                <div className="flex items-center gap-2 text-xs text-fd-muted-foreground mb-4">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(post.data.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-fd-foreground text-lg font-semibold mb-3 group-hover:text-fd-primary transition-colors line-clamp-2">
                {post.data.title}
              </h2>

              {/* Description */}
              <p className="text-fd-muted-foreground text-sm leading-relaxed flex-1 mb-5 line-clamp-3">
                {post.data.description}
              </p>

              {/* Read more link */}
              <div className="flex items-center text-sm font-medium text-fd-primary group-hover:gap-2 transition-all gap-1">
                <span>Read article</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="text-center py-20 rounded-xl border border-fd-border bg-fd-card/30 backdrop-blur-sm">
          <p className="text-fd-muted-foreground text-lg">
            No posts yet. Check back soon for new content!
          </p>
        </div>
      )}
    </main>
  );
}
