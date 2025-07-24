import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Artifact Explorer',
  description: 'Explore the CitizenFX artifacts for both GTA V AND RDR2',
};

export default function ArtifactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden">
      {children}
    </div>
  );
}