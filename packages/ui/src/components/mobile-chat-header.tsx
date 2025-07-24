"use client"

import * as React from "react"
import { Menu, Command, Bot } from "lucide-react"
import { Button } from "./button"
import { cn } from "@utils/functions/cn"

interface MobileChatHeaderProps {
    onMenuClick: () => void;
    model: string;
    temperature: number;
}

export function MobileChatHeader({
    onMenuClick,
    model,
    temperature
}: MobileChatHeaderProps) {
    return (
        <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between p-4 border-b bg-fd-background/95 backdrop-blur-md border-[#5865F2]/20 z-[100] mb-16">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    className="md:hidden"
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-[#5865F2]" />
                    <div className="flex flex-col">
                        <h2 className="text-sm font-medium">AI Chat</h2>
                        <p className="text-xs text-muted-foreground">{model} · {temperature.toFixed(1)} temperature</p>
                    </div>
                </div>
            </div>
            <div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                >
                    <Command className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
