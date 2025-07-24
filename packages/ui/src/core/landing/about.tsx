"use client";

import { BorderBeam } from "@ui/components";
import { Code, Server, Database, Globe, Bug, Settings } from "lucide-react";
import { motion } from "motion/react";

export function Features() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-10"
    >
      <div className="text-fd-foreground border-fd-border/50 relative flex h-auto max-w-[375px] flex-col overflow-hidden rounded-2xl border sm:max-w-full">
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-4">Comprehensive CitizenFX Guides</h3>
          <p className="text-fd-muted-foreground mb-8">
            Everything you need to manage servers, troubleshoot errors, and develop resources for FiveM and RedM.
          </p>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Server className="h-6 w-6" />}
              title="Server Management"
              description="Learn how to set up, update, and optimize your FXServer."
            />
            <FeatureCard
              icon={<Code className="h-6 w-6" />}
              title="Resource Development"
              description="Lua, JavaScript, and C# tutorials for creating custom resources."
            />
            <FeatureCard
              icon={<Database className="h-6 w-6" />}
              title="Framework Integration"
              description="Guides for ESX, QBCore, and other popular frameworks."
            />
            <FeatureCard
              icon={<Bug className="h-6 w-6" />}
              title="Troubleshooting"
              description="Fix common errors, crashes, and server issues."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="CitizenFX Ecosystem"
              description="Understand the CitizenFX platform and its components."
            />
            <FeatureCard
              icon={<Settings className="h-6 w-6" />}
              title="Server Artifacts"
              description="Learn how to update and manage server artifacts effectively."
            />
          </div>
        </div>
        
        <BorderBeam
          className="absolute inset-0 z-10 rounded-2xl"
          colorFrom="#2563eb"
          colorTo="#3b82f6"
          duration={4}
        />
      </div>
    </motion.div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
      className="bg-fd-background border-fd-border rounded-lg border p-4 hover:shadow-md transition-shadow"
    >
      <div className="text-blue-500 mb-3">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-fd-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
}
