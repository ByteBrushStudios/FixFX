"use client"

import * as React from "react"
import { cn } from "@utils/functions/cn"
import { Button } from "./button"
import { ScrollArea } from "./scroll-area"
import { Home, MessageSquare, Settings, History, Code, Plus, Zap, Bot, X, Github } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Label } from "./label"
import { Slider } from "./slider"
import { Sheet, SheetContent } from "./sheet"
import { Tabs, TabsList, TabsTrigger } from "./tabs"
import { ModelCard } from "./model-card"
import { NAV_LINKS, DISCORD_LINK, GITHUB_LINK } from "@utils/constants/link"
import { FaDiscord } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

interface SavedChat {
    id: string;
    title: string;
    messages: any[];
    model: string;
    temperature: number;
    timestamp: number;
    preview: string;
}

interface MobileChatDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    model: string;
    temperature: number;
    onModelChange: (model: string) => void;
    onTemperatureChange: (temperature: number) => void;
    onLoadChat: (chat: SavedChat) => void;
    onNewChat: () => void;
}

export function MobileChatDrawer({
    isOpen,
    onClose,
    model,
    temperature,
    onModelChange,
    onTemperatureChange,
    onLoadChat,
    onNewChat
}: MobileChatDrawerProps) {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<'navigation' | 'chats' | 'settings'>('navigation');
    const [recentChats, setRecentChats] = useState<SavedChat[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const drawerRef = useRef<HTMLDivElement>(null);

    // Initialize active chat from localStorage
    useEffect(() => {
        const currentChatId = localStorage.getItem('fixfx-current-chat');
        if (currentChatId) {
            setActiveChat(currentChatId);
        }
    }, []);

    // Load recent chats from localStorage
    useEffect(() => {
        const loadChats = () => {
            try {
                const savedChatsStr = localStorage.getItem('fixfx-chats');
                if (savedChatsStr) {
                    const savedChats: SavedChat[] = JSON.parse(savedChatsStr);
                    setRecentChats(savedChats);
                }
            } catch (error) {
                console.error('Error loading saved chats:', error);
            }
        };

        if (isOpen) {
            loadChats();
        }

        // Also load when we detect chat updates
        const handleChatsUpdated = () => {
            if (isOpen) loadChats();
        };

        window.addEventListener('chatsUpdated', handleChatsUpdated);
        window.addEventListener('activeChatChanged', handleChatsUpdated);

        return () => {
            window.removeEventListener('chatsUpdated', handleChatsUpdated);
            window.removeEventListener('activeChatChanged', handleChatsUpdated);
        };
    }, [isOpen]);

    // Handle selecting a chat
    const handleChatClick = (chat: SavedChat) => {
        localStorage.setItem('fixfx-current-chat', chat.id);
        setActiveChat(chat.id);
        onLoadChat(chat);
    };

    // Handle creating a new chat
    const handleNewChat = () => {
        localStorage.removeItem('fixfx-current-chat');
        setActiveChat(null);
        onNewChat();
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="left" className="w-full max-w-full sm:max-w-md border-r border-[#5865F2]/20 p-0 bg-fd-background pt-16">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-[#5865F2]/20">
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                            <TabsList className="bg-[#0F0B2B]/50 grid grid-cols-3 h-9">
                                <TabsTrigger value="navigation" className="data-[state=active]:bg-[#5865F2] data-[state=active]:text-white">
                                    Navigation
                                </TabsTrigger>
                                <TabsTrigger value="chats" className="data-[state=active]:bg-[#5865F2] data-[state=active]:text-white">
                                    Chats
                                </TabsTrigger>
                                <TabsTrigger value="settings" className="data-[state=active]:bg-[#5865F2] data-[state=active]:text-white">
                                    Settings
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Button variant="ghost" size="icon" onClick={onClose} className="ml-2">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        {activeTab === 'navigation' && (
                            <div className="space-y-1">
                                {NAV_LINKS.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Button
                                            key={item.href}
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start",
                                                pathname === item.href && "bg-[#5865F2]/20 text-[#5865F2]"
                                            )}
                                            asChild
                                            onClick={onClose}
                                        >
                                            {item.external ? (
                                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                    <Icon className="mr-2 h-4 w-4" />
                                                    {item.name}
                                                </a>
                                            ) : (
                                                <Link href={item.href} className="flex items-center">
                                                    <Icon className="mr-2 h-4 w-4" />
                                                    {item.name}
                                                </Link>
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === 'chats' && (
                            <div className="space-y-4">
                                <Button
                                    variant="outline"
                                    className="w-full justify-center hover:bg-[#5865F2]/10"
                                    onClick={handleNewChat}
                                >
                                    <Plus className="h-4 w-4 mr-2 text-[#5865F2]" />
                                    New Chat
                                </Button>

                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Recent Conversations</h4>
                                    {recentChats.length > 0 ? (
                                        recentChats.map(chat => {
                                            const isActive = activeChat === chat.id;
                                            return (
                                                <Button
                                                    key={chat.id}
                                                    variant="ghost"
                                                    className={cn(
                                                        "w-full justify-start truncate",
                                                        isActive && "bg-[#5865F2]/20 border-l-2 border-[#5865F2]"
                                                    )}
                                                    onClick={() => handleChatClick(chat)}
                                                >
                                                    <History className={cn(
                                                        "mr-2 h-4 w-4 shrink-0",
                                                        isActive && "text-[#5865F2]"
                                                    )} />
                                                    <span className="truncate">{chat.title}</span>
                                                </Button>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-2">No recent chats</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Label htmlFor="model-mobile" className="text-sm font-medium">Model Selection</Label>
                                    <ModelCard
                                        model="gpt-4o-mini"
                                        name="GPT-4o Mini"
                                        description="Balanced performance for general questions"
                                        provider="OpenAI"
                                        icon={<Zap className="h-4 w-4" />}
                                        color="#5865F2"
                                        isSelected={model === "gpt-4o-mini"}
                                        onClick={() => onModelChange("gpt-4o-mini")}
                                    />
                                    <ModelCard
                                        model="gemini-1.5-flash"
                                        name="Gemini 1.5 Flash"
                                        description="Fast responses with good accuracy"
                                        provider="Google"
                                        icon={<Bot className="h-4 w-4" />}
                                        color="#34A853"
                                        isSelected={model === "gemini-1.5-flash"}
                                        onClick={() => onModelChange("gemini-1.5-flash")}
                                        disabled
                                    />
                                    <ModelCard
                                        model="claude-3-haiku"
                                        name="Claude 3 Haiku"
                                        description="Creative with nuanced understanding"
                                        provider="Anthropic"
                                        icon={<Code className="h-4 w-4" />}
                                        color="#FF6B6C"
                                        isSelected={model === "claude-3-haiku"}
                                        onClick={() => onModelChange("claude-3-haiku")}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="temperature" className="text-white text-sm">Temperature</Label>
                                        <span className="text-xs font-medium text-muted-foreground px-2 py-1 rounded bg-[#1A1C2D]">
                                            {temperature.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="pt-1">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                            <span>Precise</span>
                                            <span>Creative</span>
                                        </div>
                                        <Slider
                                            id="temperature-mobile"
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={[temperature]}
                                            onValueChange={([value]) => onTemperatureChange(value)}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {temperature < 0.4
                                            ? "Lower values generate more focused, deterministic responses."
                                            : temperature > 0.7
                                                ? "Higher values generate more creative, varied responses."
                                                : "Balanced between deterministic and creative responses."}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-[#5865F2]/20 space-y-2">
                                    <h4 className="text-sm font-medium text-white">Privacy Info</h4>
                                    <div className="text-xs text-muted-foreground">
                                        <p className="mb-1">Chat history is stored only in your browser's local storage.</p>
                                        <p>Clear browser storage to remove your chat history.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </ScrollArea>

                    {/* Footer with GitHub and Discord links */}
                    <div className="border-t border-[#5865F2]/20 p-3 flex items-center justify-center gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-fd-background/80 hover:bg-[#5865F2]/10 hover:text-[#5865F2] flex-1"
                                        asChild
                                    >
                                        <a
                                            href={GITHUB_LINK}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center"
                                        >
                                            <Github className="h-4 w-4 mr-2" />
                                            <span>GitHub</span>
                                        </a>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>GitHub</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-fd-background/80 hover:bg-[#5865F2]/10 hover:text-[#5865F2] flex-1"
                                        asChild
                                    >
                                        <a
                                            href={DISCORD_LINK}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center"
                                        >
                                            <FaDiscord className="h-4 w-4 mr-2" />
                                            <span>Discord</span>
                                        </a>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>Discord</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
