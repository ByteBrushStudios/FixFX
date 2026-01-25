"use client"

import * as React from "react"
import { Menu, Sparkles } from "lucide-react"
import { Button } from "./button"
import { FixFXIcon } from "../icons"

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
        <div className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-3 border-b bg-fd-background/95 backdrop-blur-md border-fd-border z-[100]">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    className="h-9 w-9"
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <FixFXIcon className="h-5 w-5 text-blue-500" />
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold text-fd-foreground">Fixie</h2>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-fd-muted-foreground bg-fd-muted/50 px-2 py-1 rounded-full">
                    <Sparkles className="h-3 w-3" />
                    {modelDisplayNames[model] || model}
                </span>
            </div>
        </div>
    )
}
