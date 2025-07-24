import { motion } from "motion/react";
import { cn } from "@utils/index";
import { ReactNode } from "react";

interface ShimmerProps {
  className?: string;
  children: ReactNode;
  color?: string;
  midColor?: string;
}

export function Shimmer({
  className,
  children,
  color = "#222",
  midColor = "#fff",
}: ShimmerProps) {
  return (
    <motion.div
      animate={{ backgroundPosition: "-200% 0" }}
      className={cn("bg-clip-text text-transparent", className)}
      initial={{ backgroundPosition: "200% 0" }}
      style={{
        backgroundImage: `linear-gradient(110deg, ${color} 35%, ${midColor} 50%, ${color} 75%, ${color})`,
        backgroundSize: "200% 100%",
      }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  );
}
