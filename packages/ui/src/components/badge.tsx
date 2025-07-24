import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@utils/functions/cn"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none animate-in fade-in-50 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-500/80",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",
        ghost:
          "bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 border-background/10",
        cfx:
          "border-transparent bg-[#5865F2] text-white hover:bg-[#5865F2]/80",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.25 text-[0.65rem]",
        lg: "px-3 py-1 text-sm",
      },
      glow: {
        default: "",
        true: "shadow-[0_0_10px_rgba(var(--badge-glow-color,88,101,242),0.5)]",
      },
      interactive: {
        default: "",
        true: "cursor-pointer transform transition-transform duration-200 active:scale-95 hover:-translate-y-0.5",
      },
      shape: {
        pill: "rounded-full",
        square: "rounded-md",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "default",
      interactive: "default",
      shape: "pill",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  clickable?: boolean;
  asChild?: boolean;
}

function Badge({
  className,
  variant,
  size,
  glow,
  interactive,
  shape,
  icon,
  clickable,
  asChild = false,
  style,
  ...props
}: BadgeProps) {
  // Set CSS variable for glow color based on variant
  const badgeStyle: React.CSSProperties = { ...style };
  if (glow === true) {
    // Set default glow color based on variant
    if (variant === "success") {
      badgeStyle["--badge-glow-color"] = "34, 197, 94"; // Green-500
    } else if (variant === "warning") {
      badgeStyle["--badge-glow-color"] = "234, 179, 8"; // Yellow-500
    } else if (variant === "info") {
      badgeStyle["--badge-glow-color"] = "59, 130, 246"; // Blue-500
    } else if (variant === "destructive") {
      badgeStyle["--badge-glow-color"] = "239, 68, 68"; // Red-500
    } else if (variant === "cfx") {
      badgeStyle["--badge-glow-color"] = "88, 101, 242"; // Discord blue
    }
  }

  // For clickable badges, enhance with interactive props
  const enhancedInteractive = clickable ? true : interactive;

  // Improved layout logic
  const hasContent = Boolean(props.children);
  const iconOnly = icon && !hasContent;
  const enhancedSize = iconOnly && size === 'default' ? 'sm' : size;

  const Comp = asChild ? React.Fragment : "div";

  return (
    <Comp
      className={cn(
        badgeVariants({
          variant,
          size: enhancedSize,
          glow,
          interactive: enhancedInteractive,
          shape
        }),
        iconOnly && "aspect-square justify-center p-0", // Make icon-only badges square
        hasContent && "px-3", // More horizontal padding for badges with content
        className
      )}
      style={badgeStyle as React.CSSProperties}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {asChild ? props.children : hasContent && <span>{props.children}</span>}
    </Comp>
  )
}

export { Badge, badgeVariants }