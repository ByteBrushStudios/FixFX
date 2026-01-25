import { FixFXIcon } from "@ui/icons";
import { blog } from "@/lib/docs/source";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = blog.getPages();

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <FixFXIcon className="size-10" stroke="#8b5cf6" />
          <h1 className="text-4xl md:text-5xl font-bold text-fd-foreground">Blog</h1>
        </div>
        <p className="text-fd-muted-foreground text-lg max-w-2xl mx-auto">
          News, guides, and insights from the FixFX community
        </p>
      </div>

      {/* Posts grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Link
            key={post.url}
            href={post.url}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-fd-border bg-fd-background/50 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient accent on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex flex-col flex-1 p-6">
              {/* Meta info */}
              {post.data.date && (
                <div className="flex items-center gap-4 text-xs text-fd-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.data.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-fd-foreground text-xl font-semibold mb-2 group-hover:text-purple-500 transition-colors">
                {post.data.title}
              </h2>

              {/* Description */}
              <p className="text-fd-muted-foreground text-sm leading-relaxed flex-1 mb-4">
                {post.data.description}
              </p>

              {/* Read more link */}
              <div className="flex items-center text-sm font-medium text-purple-500 transition-colors group-hover:text-purple-400">
                <span>Read article</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-fd-muted-foreground text-lg">No posts yet. Check back soon!</p>
        </div>
      )}
    </main>
  );
}
