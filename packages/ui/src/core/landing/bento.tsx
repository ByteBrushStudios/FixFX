"use client";

import { BentoCard, BentoGrid } from "@ui/components/bento";
import { features } from "@/components/landing/cards";

export function Grid() {
  return (
    <BentoGrid>
      {features.map((features, index) => (
        <BentoCard key={index} {...features} />
      ))}
    </BentoGrid>
  );
}
