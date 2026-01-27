import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FiveM & RedM Artifact Explorer",
  description:
    "Browse and download FiveM and RedM server artifacts. Find recommended, latest, and stable builds for Windows and Linux.",
  keywords: [
    "FiveM artifacts",
    "RedM artifacts",
    "FXServer download",
    "CitizenFX artifacts",
    "FiveM server files",
    "RedM server files",
  ],
  alternates: {
    canonical: "https://fixfx.wiki/artifacts",
  },
  openGraph: {
    title: "FiveM & RedM Artifact Explorer | FixFX",
    description:
      "Browse and download FiveM and RedM server artifacts. Find recommended, latest, and stable builds.",
    url: "https://fixfx.wiki/artifacts",
    type: "website",
  },
};

export default function ArtifactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen overflow-hidden">{children}</div>;
}
