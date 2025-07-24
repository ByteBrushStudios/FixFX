import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Natives Explorer',
  description: 'Explore and search CitizenFX natives for FiveM and RedM development',
};

export default function NativesLayout({
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