"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@utils/functions/cn";

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-slate-100/10",
            className
        )}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-[#5865F2] transition-all"
            style={{
                transform: value !== undefined ? `translateX(-${100 - value}%)` : "translateX(-100%)",
                ...(value === undefined && {
                    animation: "indeterminate-progress 1.5s infinite cubic-bezier(0.65, 0.815, 0.735, 0.395)"
                })
            }}
        />
    </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
