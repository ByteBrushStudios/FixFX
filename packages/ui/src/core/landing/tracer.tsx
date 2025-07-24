"use client";

import { FixFXIcon } from "@ui/icons";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

export function Tracer() {
  return (
    <section className="mb-16 hidden md:block text-center">
      <h2 className="text-fd-muted-foreground select-none text-xl font-medium uppercase">
        Your Path to Solutions
      </h2>
      <h3 className="text-fd-foreground my-1 text-wrap text-center text-3xl font-semibold">
        Fix Issues, Learn, and Build
      </h3>
      <h4 className="text-fd-muted-foreground mt-1.5 max-w-lg mx-auto text-pretty text-center text-xl italic">
        From server crashes to framework integration, FixFX guides you every step of the way.
      </h4>
      
      <div className="mt-12 flex flex-col items-center justify-center px-4">
        {/* Replace grid with flex layout that works better on all screen sizes */}
        <div className="relative flex flex-row flex-wrap justify-center max-w-4xl mx-auto">
          {/* Process Flow Path - behind the steps */}
          <ProcessPath />
          
          {/* Steps container - with proper spacing */}
          <div className="z-10 flex flex-row flex-wrap justify-center items-center gap-x-8 sm:gap-x-16 md:gap-x-24">
            <ErrorStep />
            <FixStep />
            <SuccessStep />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessPath() {
  return (
    <div className="absolute top-1/2 left-0 w-full h-2 -mt-1 z-0 flex justify-center items-center">
      <div className="relative w-3/4 max-w-[600px] h-full">
        {/* Base Track */}
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-full" />
        
        {/* Red to Blue Section - First half */}
        <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-red-500 to-blue-500 rounded-full" />
        </div>
        
        {/* Blue to Green Section - Second half */}
        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-[200%] h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
          </div>
        </div>
      </div>
    </div>
  );
}

function MovingDot({
  color,
  startPosition = "0%",
  endPosition = "100%",
  startDelay = 0,
  duration = 1.5,
}: {
  color: string;
  startPosition?: string;
  endPosition?: string;
  startDelay?: number;
  duration?: number;
}) {
  const colorMap = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
  };

  return (
    <motion.div
      className={`absolute ${colorMap[color as keyof typeof colorMap]} h-5 w-5 rounded-full shadow-md z-20`}
      style={{
        top: "-6px",
      }}
      initial={{ left: startPosition, x: "-50%", scale: 0 }}
      animate={{
        left: endPosition,
        x: "-50%",
        scale: 1,
        transition: {
          duration: duration,
          delay: startDelay,
          repeat: Infinity,
          repeatDelay: 3 - duration - startDelay,
          ease: "linear",
        },
      }}
    />
  );
}

function ErrorStep() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center"
    >
      <div className="mb-4 relative">
        <div className="bg-fd-background border-fd-border flex items-center justify-center rounded-full border h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 shadow-lg">
          <CitizenFXLogo className="h-10 sm:h-8 md:h-10 w-10 sm:w-12 md:w-16" />
        </div>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1 sm:p-2 shadow-md"
        >
          <AlertTriangle className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 text-white" />
        </motion.div>
      </div>
      <h5 className="text-fd-foreground font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">Encounter Error</h5>
      <p className="text-fd-muted-foreground text-xs sm:text-sm max-w-[120px] sm:max-w-[150px] md:max-w-[180px]">
        Server crashes or resource errors in your FiveM setup.
      </p>
    </motion.div>
  );
}

function FixStep() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="flex flex-col items-center"
    >
      <div className="mb-4 relative">
        <div className="bg-fd-background border-fd-border flex items-center justify-center rounded-full border h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 shadow-lg">
          <FixFXIcon className="h-10 sm:h-8 md:h-10 w-10 sm:w-12 md:w-16" stroke="#3b82f6" />
        </div>
        <motion.div 
          className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <svg className="h-4 sm:h-6 md:h-8 w-4 sm:w-6 md:w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 6V12L16 14" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
      <h5 className="text-fd-foreground font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">Find Solutions</h5>
      <p className="text-fd-muted-foreground text-xs sm:text-sm max-w-[120px] sm:max-w-[150px] md:max-w-[180px]">
        Reference our guides and troubleshooting docs.
      </p>
    </motion.div>
  );
}

function SuccessStep() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6 }}
      className="flex flex-col items-center"
    >
      <div className="mb-4 relative">
        <div className="bg-fd-background border-fd-border flex items-center justify-center rounded-full border h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 shadow-lg">
          <span className="text-2xl sm:text-3xl md:text-4xl">😄</span>
        </div>
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 sm:p-2 shadow-md"
        >
          <CheckCircle className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 text-white" />
        </motion.div>
      </div>
      <h5 className="text-fd-foreground font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">Problem Solved</h5>
      <p className="text-fd-muted-foreground text-xs sm:text-sm max-w-[120px] sm:max-w-[150px] md:max-w-[180px]">
        Back to enjoying your CitizenFX experience.
      </p>
    </motion.div>
  );
}

function CitizenFXLogo({ className }: { className?: string }) {
  return (
    <Image src="/cfx.png" alt="CitizenFX Logo" width={48} height={48} className={className} />
  );
}
