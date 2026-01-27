import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";

export const metadata: Metadata = {
  title: "Hosting Partners - FixFX",
  description:
    "Explore our trusted hosting partners for your FiveM and RedM servers. Get exclusive discounts on high-performance game server hosting.",
  alternates: {
    canonical: "https://fixfx.wiki/hosting",
  },
  openGraph: {
    title: "Hosting Partners - FixFX",
    description:
      "Explore our trusted hosting partners for your FiveM and RedM servers. Get exclusive discounts on high-performance game server hosting.",
    url: "https://fixfx.wiki/hosting",
    type: "website",
  },
};

export default function HostingLayout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
}
