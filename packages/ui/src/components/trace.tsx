"use client";

import { motion } from "motion/react";
import { useId } from "react";

interface TraceProps {
  width: number | string;
  height: number | string;
  baseColor?: string;
  gradientColors?: string[];
  animationDuration?: number;
  strokeWidth?: number;
  vertical?: boolean;
}

export function Trace({
  width,
  height,
  baseColor = "#525252",
  gradientColors = ["#2EB9DF", "#2EB9DF", "#9E00FF"],
  animationDuration = 2,
  strokeWidth = 2,
  vertical = false,
}: TraceProps) {
  const gradientId = `pulse-${useId()}`;
  
  // Convert width and height to numbers if they're strings for calculations
  const widthNum = typeof width === "string" ? parseInt(width) : width;
  const heightNum = typeof height === "string" ? parseInt(height) : height;

  return (
    <div className="pointer-events-none relative" style={{ width, height }}>
      <svg
        fill="none"
        height={height}
        viewBox={`0 0 ${widthNum} ${heightNum}`}
        width={width}
      >
        <line
          stroke={baseColor}
          strokeOpacity="0.2"
          x1={vertical ? widthNum / 2 : 0}
          x2={vertical ? widthNum / 2 : widthNum}
          y1={vertical ? 0 : heightNum / 2}
          y2={vertical ? heightNum : heightNum / 2}
        />
        <line
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          x1={vertical ? widthNum / 2 : 0}
          x2={vertical ? widthNum / 2 : widthNum}
          y1={vertical ? 0 : heightNum / 2}
          y2={vertical ? heightNum : heightNum / 2}
        />
        <defs>
          <motion.linearGradient
            animate={{
              x1: vertical ? [0, 0] : [0, widthNum * 2],
              x2: vertical ? [0, 0] : [0, widthNum],
              y1: vertical ? [0, heightNum * 2] : [0, 0],
              y2: vertical ? [0, heightNum] : [0, 0],
            }}
            gradientUnits="userSpaceOnUse"
            id={gradientId}
            initial={{
              x1: vertical ? 0 : 0,
              x2: vertical ? 0 : widthNum * 2,
              y1: vertical ? 0 : 0,
              y2: vertical ? 0 : heightNum * 2,
            }}
            transition={{
              duration: animationDuration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <stop stopColor={gradientColors[0]} stopOpacity="0" />
            <stop stopColor={gradientColors[1]} />
            <stop offset="1" stopColor={gradientColors[2]} stopOpacity="0" />
          </motion.linearGradient>
        </defs>
      </svg>
    </div>
  );
}
