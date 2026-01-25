import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { Grid } from "@ui/components";
import type { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>): React.ReactElement {
  return (
    <HomeLayout {...baseOptions}>
      {children}
      {/* Background grid */}
      <Grid
        width={40}
        height={40}
        x={-1}
        y={-1}
        strokeDasharray={"4 4"}
        className="fixed inset-0 -z-50 opacity-40 dark:opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,white,transparent)]"
      />
      {/* Gradient overlay */}
      <div className="fixed inset-0 -z-40 bg-gradient-to-b from-transparent via-transparent to-fd-background/80 pointer-events-none" />
    </HomeLayout>
  );
}
