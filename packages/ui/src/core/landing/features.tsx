"use client";

import { BorderBeam } from "@ui/components";
import { Code, Server, Database, Globe, Bug, Users } from "lucide-react";
import { motion } from "motion/react";

export function Features() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-10"
    >
      <div className="text-fd-foreground relative flex h-auto flex-col overflow-hidden">
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-4">FiveM & RedM Solutions</h3>
          <p className="text-fd-muted-foreground mb-8">
            Comprehensive guides for server owners, developers, and players in the CitizenFX ecosystem.
          </p>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
            <FeatureCard
              icon={<Server className="h-6 w-6" />}
              title="Server Management"
              description="Setup, maintenance, and optimization guides for FiveM and RedM server owners."
            />
            <FeatureCard
              icon={<Code className="h-6 w-6" />}
              title="Resource Development"
              description="Lua, JavaScript and C# tutorials for creating custom CitizenFX resources."
            />
            <FeatureCard
              icon={<Database className="h-6 w-6" />}
              title="Database Integration"
              description="MySQL, MongoDB and framework integration solutions for server data persistence."
            />
            <FeatureCard
              icon={<Bug className="h-6 w-6" />}
              title="Common Error Solutions"
              description="Fixes for artifacts, client crashes, server errors, and networking issues."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Multiplayer Frameworks"
              description="ESX, QBCore, vRP, and other popular FiveM/RedM framework documentation."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Player Guides"
              description="Installation help, mod management, and troubleshooting for players."
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
    <div className="bg-fd-background border-fd-border rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="text-blue-500 mb-3">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-fd-muted-foreground text-sm">{description}</p>
    </div>
  );
}
