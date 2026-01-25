"use client";

import { FixFXIcon } from "@ui/icons";
import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

export function Tracer() {
  return (
    <section className="w-full max-w-5xl mx-auto py-12 md:py-20 px-4">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 md:mb-16"
      >
        <span className="text-blue-500 font-medium text-sm uppercase tracking-wider">
          How It Works
        </span>
        <h2 className="text-fd-foreground mt-3 text-3xl md:text-4xl font-bold">
          Fix Issues, Learn, and Build
        </h2>
        <p className="text-fd-muted-foreground mt-4 max-w-lg mx-auto text-base md:text-lg">
          From server crashes to framework integration, FixFX guides you every step of the way.
        </p>
      </motion.div>

      {/* Steps - responsive layout */}
      <div className="relative">
        {/* Connection line - horizontal on md+, vertical on mobile */}
        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-1 -translate-y-1/2 z-0">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-red-500 via-blue-500 to-green-500 opacity-30" />
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-red-500 via-blue-500 to-green-500"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
        </div>

        {/* Mobile vertical line */}
        <div className="md:hidden absolute left-1/2 top-[80px] bottom-[80px] w-1 -translate-x-1/2 z-0">
          <div className="h-full w-full rounded-full bg-gradient-to-b from-red-500 via-blue-500 to-green-500 opacity-30" />
          <motion.div
            className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-red-500 via-blue-500 to-green-500"
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
        </div>

        {/* Steps container */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          <Step
            icon={<CitizenFXLogo className="h-8 w-8 md:h-10 md:w-10" />}
            badge={<AlertTriangle className="h-4 w-4 text-white" />}
            badgeColor="bg-red-500"
            title="Encounter Error"
            description="Server crashes or resource errors in your FiveM/RedM setup"
            delay={0.2}
          />

          {/* Arrow for mobile */}
          <motion.div
            className="md:hidden text-fd-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <ArrowRight className="h-5 w-5 rotate-90" />
          </motion.div>

          <Step
            icon={<FixFXIcon className="h-8 w-8 md:h-10 md:w-10" stroke="#3b82f6" />}
            badge={
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            badgeColor="bg-blue-500"
            title="Find Solutions"
            description="Browse our comprehensive guides and troubleshooting docs"
            delay={0.5}
          />

          {/* Arrow for mobile */}
          <motion.div
            className="md:hidden text-fd-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <ArrowRight className="h-5 w-5 rotate-90" />
          </motion.div>

          <Step
            icon={<span className="text-3xl md:text-4xl">🎮</span>}
            badge={<CheckCircle className="h-4 w-4 text-white" />}
            badgeColor="bg-green-500"
            title="Problem Solved"
            description="Get back to enjoying your CitizenFX experience"
            delay={0.8}
          />
        </div>
      </div>
    </section>
  );
}

function Step({
  icon,
  badge,
  badgeColor,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  badge: React.ReactNode;
  badgeColor: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center text-center max-w-[200px]"
    >
      <div className="relative mb-4">
        <div className="flex items-center justify-center rounded-2xl border border-fd-border bg-fd-background h-20 w-20 md:h-24 md:w-24 shadow-lg">
          {icon}
        </div>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
          className={`absolute -bottom-2 -right-2 ${badgeColor} rounded-full p-2 shadow-md`}
        >
          {badge}
        </motion.div>
      </div>
      <h3 className="text-fd-foreground font-semibold text-base md:text-lg mb-1">
        {title}
      </h3>
      <p className="text-fd-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function CitizenFXLogo({ className }: { className?: string }) {
  return (
    <Image src="/cfx.png" alt="CitizenFX Logo" width={48} height={48} className={className} />
  );
}
