import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { source } from "@/lib/docs/source";
import { metadataImage } from "@/lib/docs/metadata";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { notFound } from "next/navigation";
import { DOCS_URL } from "@utils/index";
import { Editor } from "@ui/core/docs/editor";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  
  // Redirect to overview if no slug is provided (root /docs path)
  if (!slug || slug.length === 0) {
    return source.getPage(['overview']);
  }

  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      lastUpdate={page.data.lastModified}
      tableOfContent={{
        style: 'clerk',
        single: false,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            img: (props) => props.src ? <ImageZoom {...(props as any)} /> : null,
            Editor: Editor
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return metadataImage.withImage(page.slugs, {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      siteName: "FixFX",
      url: `${DOCS_URL}/docs/${page.slugs.join("/")}`,
    },
  });
}
