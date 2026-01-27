import defaultMdxComponents from "fumadocs-ui/mdx";
import { CornerDownLeft } from "@ui/icons";
import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { blog } from "@/lib/docs/source";
import Link from "next/link";

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const page = blog.getPage([slug]);

  if (!page) notFound();
  const Mdx = page.data.body;

  return (
    <>
      <div className="bg-fd-background container mt-8 rounded-xl border border-fd-border p-8 backdrop-blur-sm">
        <h1 className="text-3xl md:text-4xl mb-3 font-bold text-fd-foreground">
          {page.data.title}
        </h1>
        <p className="text-fd-muted-foreground mb-6 text-base md:text-lg leading-relaxed">
          {page.data.description}
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-2 text-sm text-fd-muted-foreground">
            <Calendar className="size-4" />
            <span>{new Date(page.data.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}</span>
            {page.data.author && (
              <>
                <span className="mx-2">•</span>
                <span>{page.data.author}</span>
              </>
            )}
          </div>
          <Link
            href="/blog"
            className="bg-fd-background border-fd-border hover:bg-fd-muted hover:border-fd-foreground/20 inline-flex transform items-center gap-x-2 rounded-lg border px-4 py-2 transition-all duration-200"
          >
            <CornerDownLeft className="inline-block size-4" />
            Back to Blog
          </Link>
        </div>
      </div>
      <article className="container flex flex-col px-4 py-8 md:py-12">
        <div className="prose prose-fd dark:prose-invert max-w-none min-w-0">
          <Mdx components={defaultMdxComponents} />
        </div>
        <hr className="border-t-fd-border my-12 border-t" />
        <div className="flex flex-col gap-6 text-sm">
          <div>
            <p className="text-fd-muted-foreground mb-2 font-semibold">Written by</p>
            <p className="font-medium text-fd-foreground text-base">{page.data.author}</p>
          </div>
          <div>
            <p className="text-fd-muted-foreground mb-2 font-semibold">Published</p>
            <p className="font-medium text-fd-foreground text-base">
              {new Date(page.data.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </article>
    </>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
