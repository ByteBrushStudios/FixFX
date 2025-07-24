import { cn } from "@utils/functions/cn"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional className for additional styling
   */
  className?: string
  
  /**
   * Whether to show pulsing animation effect
   * @default true
   */
  pulse?: boolean
  
  /**
   * Whether to show shimmer animation effect instead of pulse
   * @default false
   */
  shimmer?: boolean
}

/**
 * Skeleton component for placeholder loading states
 */
export function Skeleton({
  className,
  pulse = true,
  shimmer = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-gray-800/40 dark:bg-gray-700/40", 
        pulse && !shimmer && "animate-pulse",
        shimmer && "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}
