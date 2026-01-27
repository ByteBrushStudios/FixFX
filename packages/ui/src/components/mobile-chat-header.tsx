"use client"

import * as React from "react"
import { Menu, Sparkles } from "lucide-react"
import { Button } from "./button"
import { Badge } from "./badge"
import { FixFXIcon } from "../icons"
import { motion } from "motion/react"

interface MobileChatHeaderProps {
    onMenuClick: () => void;
    model: string;
    temperature: number;
}

const modelDisplayNames: Record<string, string> = {
    "gpt-4o": "GPT-4o",
    "gpt-4o-mini": "GPT-4o Mini",
    "gpt-4-turbo": "GPT-4 Turbo",
    "gpt-3.5-turbo": "GPT-3.5",
    "gemini-1.5-flash": "Gemini Flash",
    "claude-3-haiku": "Claude Haiku"
};

export function MobileChatHeader({
    onMenuClick,
    model,
    temperature
}: MobileChatHeaderProps) {
    return (
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-3 border-b bg-fd-background/95 backdrop-blur-xl border-[#5865F2]/10 z-[100]"
        >
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    className="h-9 w-9 hover:bg-[#5865F2]/10"
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/5">
                        <FixFXIcon className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold text-fd-foreground">Fixie</h2>
                    </div>
                </div>
            </div>
            <Badge 
                variant="secondary" 
                className="h-6 px-2.5 text-xs bg-gradient-to-r from-[#5865F2]/10 to-[#5865F2]/5 text-[#5865F2] border border-[#5865F2]/20 rounded-full"
            >
                <Sparkles className="h-3 w-3 mr-1.5" />
                {modelDisplayNames[model] || model}
            </Badge>
        </motion.div>
    )
}
