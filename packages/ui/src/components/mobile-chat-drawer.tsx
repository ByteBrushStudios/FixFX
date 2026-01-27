"use client";

import * as React from "react";
import { cn } from "@utils/functions/cn";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import {
  Home,
  MessageSquare,
  Settings,
  History,
  Code,
  Plus,
  Zap,
  Bot,
  X,
  Github,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Label } from "./label";
import { Slider } from "./slider";
import { Sheet, SheetContent } from "./sheet";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { ModelCard } from "./model-card";
import { NAV_LINKS, DISCORD_LINK, GITHUB_LINK } from "@utils/constants/link";
import { FaDiscord } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { motion } from "motion/react";

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
  onNewChat,
}: MobileChatDrawerProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<
    "navigation" | "chats" | "settings"
  >("navigation");
  const [recentChats, setRecentChats] = useState<SavedChat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Initialize active chat from localStorage
  useEffect(() => {
    const currentChatId = localStorage.getItem("fixfx-current-chat");
    if (currentChatId) {
      setActiveChat(currentChatId);
    }
  }, []);

  // Load recent chats from localStorage
  useEffect(() => {
    const loadChats = () => {
      try {
        const savedChatsStr = localStorage.getItem("fixfx-chats");
        if (savedChatsStr) {
          const savedChats: SavedChat[] = JSON.parse(savedChatsStr);
          setRecentChats(savedChats);
        }
      } catch (error) {
        console.error("Error loading saved chats:", error);
      }
    };

    if (isOpen) {
      loadChats();
    }

    // Also load when we detect chat updates
    const handleChatsUpdated = () => {
      if (isOpen) loadChats();
    };

    window.addEventListener("chatsUpdated", handleChatsUpdated);
    window.addEventListener("activeChatChanged", handleChatsUpdated);

    return () => {
      window.removeEventListener("chatsUpdated", handleChatsUpdated);
      window.removeEventListener("activeChatChanged", handleChatsUpdated);
    };
  }, [isOpen]);

  // Handle selecting a chat
  const handleChatClick = (chat: SavedChat) => {
    localStorage.setItem("fixfx-current-chat", chat.id);
    setActiveChat(chat.id);
    onLoadChat(chat);
  };

  // Handle creating a new chat
  const handleNewChat = () => {
    localStorage.removeItem("fixfx-current-chat");
    setActiveChat(null);
    onNewChat();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        className="w-full max-w-full sm:max-w-md border-r border-[#5865F2]/10 p-0 bg-fd-background/95 backdrop-blur-xl pt-16"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-[#5865F2]/10">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as any)}
            >
              <TabsList className="bg-[#0F0B2B]/60 grid grid-cols-3 h-10 rounded-xl p-1">
                <TabsTrigger
                  value="navigation"
                  className="rounded-lg text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#5865F2] data-[state=active]:to-[#4752C4] data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  Navigation
                </TabsTrigger>
                <TabsTrigger
                  value="chats"
                  className="rounded-lg text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#5865F2] data-[state=active]:to-[#4752C4] data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  Chats
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="rounded-lg text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#5865F2] data-[state=active]:to-[#4752C4] data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-2 hover:bg-[#5865F2]/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            {activeTab === "navigation" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                {NAV_LINKS.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start rounded-lg transition-all duration-200",
                          pathname === item.href
                            ? "bg-gradient-to-r from-[#5865F2]/20 to-[#5865F2]/5 text-[#5865F2] border-l-2 border-[#5865F2]"
                            : "hover:bg-[#5865F2]/10",
                        )}
                        asChild
                        onClick={onClose}
                      >
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
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
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === "chats" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Button
                  variant="outline"
                  className="w-full justify-center rounded-xl border-[#5865F2]/20 hover:bg-[#5865F2]/10 hover:border-[#5865F2]/30"
                  onClick={handleNewChat}
                >
                  <Plus className="h-4 w-4 mr-2 text-[#5865F2]" />
                  New Chat
                </Button>

                <div className="space-y-1">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1 mb-2">
                    Recent Conversations
                  </h4>
                  {recentChats.length > 0 ? (
                    recentChats.map((chat, index) => {
                      const isActive = activeChat === chat.id;
                      return (
                        <motion.div
                          key={chat.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start truncate rounded-lg transition-all duration-200",
                              isActive
                                ? "bg-gradient-to-r from-[#5865F2]/20 to-[#5865F2]/5 border-l-2 border-[#5865F2]"
                                : "hover:bg-[#5865F2]/10",
                            )}
                            onClick={() => handleChatClick(chat)}
                          >
                            <History
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                isActive && "text-[#5865F2]",
                              )}
                            />
                            <span className="truncate">{chat.title}</span>
                          </Button>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <MessagesSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No recent chats
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-[#5865F2]" />
                    <Label
                      htmlFor="model-mobile"
                      className="text-sm font-medium"
                    >
                      Model Selection
                    </Label>
                  </div>
                  <p className="text-xs text-fd-muted-foreground">
                    Choose the AI model for your chat.
                  </p>

                  {/* OpenAI Models */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-medium text-fd-muted-foreground uppercase tracking-widest">
                      OpenAI
                    </span>
                    <ModelCard
                      model="gpt-4o"
                      name="GPT-4o"
                      description="Most capable model"
                      provider="OpenAI"
                      icon={<Zap className="h-4 w-4" />}
                      color="#10B981"
                      isSelected={model === "gpt-4o"}
                      onClick={() => onModelChange("gpt-4o")}
                      isNew
                    />
                    <ModelCard
                      model="gpt-4o-mini"
                      name="GPT-4o Mini"
                      description="Balanced performance"
                      provider="OpenAI"
                      icon={<Zap className="h-4 w-4" />}
                      color="#5865F2"
                      isSelected={model === "gpt-4o-mini"}
                      onClick={() => onModelChange("gpt-4o-mini")}
                    />
                    <ModelCard
                      model="gpt-4-turbo"
                      name="GPT-4 Turbo"
                      description="Fast and powerful"
                      provider="OpenAI"
                      icon={<Zap className="h-4 w-4" />}
                      color="#8B5CF6"
                      isSelected={model === "gpt-4-turbo"}
                      onClick={() => onModelChange("gpt-4-turbo")}
                      isNew
                    />
                    <ModelCard
                      model="gpt-3.5-turbo"
                      name="GPT-3.5 Turbo"
                      description="Fast for simple queries"
                      provider="OpenAI"
                      icon={<Bot className="h-4 w-4" />}
                      color="#6366F1"
                      isSelected={model === "gpt-3.5-turbo"}
                      onClick={() => onModelChange("gpt-3.5-turbo")}
                      isNew
                    />
                  </div>

                  {/* Coming Soon */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-medium text-fd-muted-foreground uppercase tracking-widest">
                      Coming Soon
                    </span>
                    <ModelCard
                      model="gemini-1.5-flash"
                      name="Gemini 1.5 Flash"
                      description="Fast responses"
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
                      description="Creative understanding"
                      provider="Anthropic"
                      icon={<Code className="h-4 w-4" />}
                      color="#FF6B6C"
                      isSelected={model === "claude-3-haiku"}
                      onClick={() => onModelChange("claude-3-haiku")}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-3 bg-gradient-to-br from-[#0F0B2B]/60 to-[#0F0B2B]/30 p-4 rounded-xl border border-[#5865F2]/10">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature" className="text-white text-sm">
                      Temperature
                    </Label>
                    <span className="text-xs font-medium text-[#5865F2] px-2 py-1 rounded-lg bg-[#5865F2]/10">
                      {temperature.toFixed(1)}
                    </span>
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
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
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {temperature < 0.4
                      ? "Lower values generate more focused, deterministic responses."
                      : temperature > 0.7
                        ? "Higher values generate more creative, varied responses."
                        : "Balanced between deterministic and creative responses."}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#5865F2]/10 space-y-2">
                  <h4 className="text-sm font-medium text-white">
                    Privacy Info
                  </h4>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <p className="mb-1">
                      Chat history is stored only in your browser's local
                      storage.
                    </p>
                    <p>Clear browser storage to remove your chat history.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </ScrollArea>

          {/* Footer with GitHub and Discord links */}
          <div className="border-t border-[#5865F2]/10 p-3 flex items-center justify-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-fd-background/80 border-[#5865F2]/10 hover:bg-[#5865F2]/10 hover:text-[#5865F2] hover:border-[#5865F2]/20 flex-1 rounded-lg transition-all duration-200"
                    asChild
                  >
                    <a
                      href={GITHUB_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      <span className="text-xs">GitHub</span>
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
                    className="bg-fd-background/80 border-[#5865F2]/10 hover:bg-[#5865F2]/10 hover:text-[#5865F2] hover:border-[#5865F2]/20 flex-1 rounded-lg transition-all duration-200"
                    asChild
                  >
                    <a
                      href={DISCORD_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <FaDiscord className="h-4 w-4 mr-2" />
                      <span className="text-xs">Discord</span>
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
