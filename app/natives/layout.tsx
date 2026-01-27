import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'FiveM & RedM Native Reference',
  description: 'Complete native function reference for FiveM and RedM development. Search and explore client and server natives with examples.',
  keywords: ['FiveM natives', 'RedM natives', 'CitizenFX natives', 'native functions', 'FiveM API', 'RedM API', 'GTA5 natives', 'RDR3 natives'],
  alternates: {
    canonical: 'https://fixfx.wiki/natives',
  },
  openGraph: {
    title: 'FiveM & RedM Native Reference | FixFX',
    description: 'Complete native function reference for FiveM and RedM development. Search and explore client and server natives.',
    url: 'https://fixfx.wiki/natives',
    type: 'website',
  },
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