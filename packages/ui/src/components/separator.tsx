"use client";

import * as React from "react";
import { cn } from "@utils/functions/cn";

interface SeparatorProps {
    className?: string;
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
    ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role={decorative ? "presentation" : "separator"}
                aria-orientation={decorative ? undefined : orientation}
                className={cn(
                    "shrink-0 bg-slate-700/50",
                    orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                    className
                )}
                {...props}
            />
        );
    }
);

Separator.displayName = "Separator";

export { Separator };
