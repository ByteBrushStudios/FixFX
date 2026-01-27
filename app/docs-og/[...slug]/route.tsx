import { metadataImage } from "@/lib/docs/metadata";
import { generateOGImage } from "fumadocs-ui/og";

export const dynamic = "force-dynamic";

export const GET = metadataImage.createAPI((page) => {
  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: "FixFX",
    primaryColor: "#3b82f6",
    primaryTextColor: "#f8fafc",
  });
});

export function generateStaticParams() {
  return [];
}
