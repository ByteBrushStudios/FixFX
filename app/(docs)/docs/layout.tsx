import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { GithubInfo } from '@ui/components/githubInfo';
import { baseOptions } from "@/app/layout.config";
import { FixFXIcon } from "@ui/icons";
import { source } from "@/lib/docs/source";
import type { ReactNode } from "react";

const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  sidebar: {
    tabs: [
      {
        title: "Core Documentation",
        icon: <FixFXIcon className="m-0 size-6 md:mb-7" />,
        description: "An introduction to FixFX.",
        url: "/docs/core",
      },
      {
        title: "CitizenFX Ecosystem",
        icon: <FixFXIcon className="m-0 size-6 md:mb-7" stroke="#f97316" />,
        description: "Understand the CitizenFX platform and its components.",
        url: "/docs/cfx",
      },
    ],
  },
};

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <DocsLayout {...docsOptions}>{children}</DocsLayout>;
}
