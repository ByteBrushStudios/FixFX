'use client';

import { useChat } from 'ai/react';
import { Button, Card } from '@ui/components';
import { Input } from '@ui/components/input';
import { ScrollArea } from '@ui/components/scroll-area';
import { cn } from '@utils/functions/cn';
import { useEffect, useRef, useState } from 'react';
import { Code, Loader2, AlertCircle, X, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface ChatInterfaceProps {
    model: string;
    temperature: number;
    initialMessages?: Message[];
    fullHeight?: boolean;
}

export interface SavedChat {
    id: string;
    title: string;
    messages: Message[];
    model: string;
    temperature: number;
    timestamp: number;
    preview: string;
}

export function ChatInterface({ model, temperature, initialMessages, fullHeight = false }: ChatInterfaceProps) {
    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
        api: '/api/chat',
        body: {
            model,
            temperature,
        },
        initialMessages,
    });
    const [showNotice, setShowNotice] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [isExistingChat, setIsExistingChat] = useState(false);

    // Reference to track if we've already saved this message set
    const savedMessagesRef = useRef<Message[]>([]);

    // Add a ref for the chat container
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Skip initial setup if we're loading an existing chat
    useEffect(() => {
        if (initialMessages && initialMessages.length > 0) {
            // For existing chats, ensure we keep the current chat ID
            const existingChatId = localStorage.getItem('fixfx-current-chat');
            if (existingChatId && currentChatId !== existingChatId) {
                setCurrentChatId(existingChatId);
                setIsExistingChat(true);

                // Make sure we preserve the timestamps from the saved messages
                // by using the initialMessages directly instead of recreating them
                savedMessagesRef.current = [...initialMessages];
                console.log("[ChatInterface] Using existing chat ID:", existingChatId);
            }
            return;
        } else if (!isExistingChat) {
            // For new chats, clear the active chat ID if it wasn't already cleared
            if (localStorage.getItem('fixfx-current-chat')) {
                localStorage.removeItem('fixfx-current-chat');
                console.log("[ChatInterface] New chat, cleared active chat ID");
            }
        }

        if (messages.length === 0) {
            setMessages([
                {
                    id: uuidv4(),
                    role: 'assistant',
                    content: 'Hello! I\'m your AI assistant for CitizenFX. How can I help you today?',
                    createdAt: new Date(),
                },
            ]);
        }
    }, [initialMessages, setMessages, isExistingChat, currentChatId, messages.length]);

    // Fix the chat saving effect
    useEffect(() => {
        // Skip if nothing changed
        if (messages.length <= 1) return;
        if (isExistingChat && messages.length === initialMessages?.length) return;

        // Skip if we've already saved these exact messages
        if (JSON.stringify(messages) === JSON.stringify(savedMessagesRef.current)) {
            return;
        }

        // Capture user message for title
        const firstUserMessage = messages.find(m => m.role === 'user');
        if (!firstUserMessage) return;

        console.log("[ChatInterface] Saving chat, messages length:", messages.length);

        // Update our saved reference
        savedMessagesRef.current = [...messages];

        // Continue with the rest of chat saving logic...
        let chatId = currentChatId;
        if (!chatId) {
            chatId = uuidv4();
            setCurrentChatId(chatId);
            console.log("[ChatInterface] New chat created with ID:", chatId);
        }

        const title = firstUserMessage.content
            .split(/[.!?]/)[0] // Take the first sentence or phrase
            .trim() // Remove extra spaces
            .slice(0, 30) // Limit to 30 characters
            .concat(firstUserMessage.content.length > 30 ? "..." : ""); // Add ellipsis if truncated

        // Ensure all messages have timestamps
        const messagesWithTimestamps = messages.map(msg => ({
            ...msg,
            // Preserve existing timestamp or createdAt, or create a new one
            timestamp: msg.timestamp || (msg.createdAt ? msg.createdAt.getTime() : Date.now())
        }));

        const chatToSave: SavedChat = {
            id: chatId,
            title,
            messages: messagesWithTimestamps,
            model,
            temperature,
            timestamp: Date.now(),
            preview: firstUserMessage.content,
        };

        const existingChatsStr = localStorage.getItem('fixfx-chats');
        let existingChats: SavedChat[] = [];

        try {
            if (existingChatsStr) {
                existingChats = JSON.parse(existingChatsStr);
            }

            const chatIndex = existingChats.findIndex(chat => chat.id === chatId);
            const contentMatchIndex = existingChats.findIndex(chat => {
                const firstUserMsg = chat.messages.find(m => m.role === 'user');
                return firstUserMsg && firstUserMsg.content === firstUserMessage.content;
            });

            if (chatIndex === -1 && contentMatchIndex >= 0) {
                chatId = existingChats[contentMatchIndex].id;
                setCurrentChatId(chatId);
            }

            const indexToUpdate = chatIndex >= 0 ? chatIndex : contentMatchIndex;

            if (indexToUpdate >= 0) {
                existingChats[indexToUpdate] = chatToSave;

                if (indexToUpdate > 0) {
                    existingChats = [
                        existingChats[indexToUpdate],
                        ...existingChats.slice(0, indexToUpdate),
                        ...existingChats.slice(indexToUpdate + 1)
                    ];
                }
            } else {
                existingChats = [chatToSave, ...existingChats];
            }

            // Keep only the most recent 20 chats
            const updatedChats = existingChats.slice(0, 20);
            localStorage.setItem('fixfx-chats', JSON.stringify(updatedChats));
            localStorage.setItem('fixfx-current-chat', chatId);

            // Dispatch event only once per save, with a small delay
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('chatsUpdated'));
            }, 10);
        } catch (error) {
            console.error('Error handling chat save:', error);
        }
    }, [messages, model, temperature, isExistingChat, initialMessages, currentChatId]);

    // Add a scroll to bottom function with enhanced behavior
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            // Use requestAnimationFrame for smoother scrolling
            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    };

    // Improved effect to scroll when messages change
    useEffect(() => {
        // First immediate scroll without animation for initial position
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ block: 'end' });
        }

        // Then smooth scroll with a delay to ensure DOM updates are complete
        const timeout = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeout);
    }, [messages]);

    // Improved resize handler for mobile
    useEffect(() => {
        const handleResize = () => {
            // On mobile, ensure content is visible when keyboard opens/closes
            if (window.innerWidth < 768) {
                // Set a short delay to let keyboard animation finish
                setTimeout(() => {
                    // Force scroll to bottom
                    messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });

                    // For iOS specifically, sometimes we need an extra scroll
                    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                        setTimeout(scrollToBottom, 300);
                    }
                }, 100);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Add an effect to focus the input field when a new chat is started
    useEffect(() => {
        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputElement && messages.length <= 1) {
            inputElement.focus();
        }
    }, [messages.length]);

    const formatTimestamp = (timestamp: number | undefined) => {
        // If timestamp is undefined or invalid, use current time as fallback
        const messageDate = timestamp && !isNaN(timestamp) ? new Date(timestamp) : new Date();

        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        const timeStr = messageDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        if (messageDate.toDateString() === now.toDateString()) {
            return `Today at ${timeStr}`;
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return `Yesterday at ${timeStr}`;
        } else {
            const dateStr = messageDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
            return `${dateStr} at ${timeStr}`;
        }
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const renderMessageContent = (content: string) => {
        return (
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        const code = String(children).replace(/\n$/, '');

                        if (!inline && language) {
                            return (
                                <div className="relative group my-4 rounded-md overflow-hidden">
                                    <div className="flex items-center justify-between bg-gray-800 px-4 py-1 text-xs font-mono text-gray-300">
                                        <span>{language}</span>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 text-gray-400 hover:text-white"
                                            onClick={() => handleCopyCode(code)}
                                        >
                                            {copiedCode === code ? (
                                                <Check className="h-3.5 w-3.5" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                    <SyntaxHighlighter
                                        language={language}
                                        style={vscDarkPlus}
                                        customStyle={{ margin: 0, borderRadius: '0px', padding: '1rem' }}
                                        wrapLongLines={true}
                                        {...props}
                                    >
                                        {code}
                                    </SyntaxHighlighter>
                                </div>
                            );
                        }
                        return <code className="bg-gray-800/50 px-1 py-0.5 rounded text-sm" {...props}>{children}</code>;
                    },
                    p({ children }) {
                        return <p className="mb-2 last:mb-0">{children}</p>;
                    },
                    ul({ children }) {
                        return <ul className="list-disc pl-6 mb-4">{children}</ul>;
                    },
                    ol({ children }) {
                        return <ol className="list-decimal pl-6 mb-4">{children}</ol>;
                    },
                    li({ children }) {
                        return <li className="mb-1">{children}</li>;
                    },
                    h1({ children }) {
                        return <h1 className="text-xl font-bold mb-2 mt-4">{children}</h1>;
                    },
                    h2({ children }) {
                        return <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>;
                    },
                    h3({ children }) {
                        return <h3 className="text-md font-bold mb-2 mt-3">{children}</h3>;
                    },
                    blockquote({ children }) {
                        return <blockquote className="border-l-2 border-gray-500 pl-4 italic my-2">{children}</blockquote>;
                    },
                    a({ children, href }) {
                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#5865F2] hover:underline"
                            >
                                {children}
                            </a>
                        );
                    },
                    table({ children }) {
                        return (
                            <div className="overflow-x-auto my-4">
                                <table className="w-full border-collapse border border-gray-700">
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    th({ children }) {
                        return <th className="border border-gray-700 bg-gray-800 px-4 py-2 text-left">{children}</th>;
                    },
                    td({ children }) {
                        return <td className="border border-gray-700 px-4 py-2">{children}</td>;
                    },
                    img({ src, alt }) {
                        return <img src={src} alt={alt} className="max-w-full h-auto my-2 rounded" />;
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        );
    };

    return (
        <Card
            ref={chatContainerRef}
            className={cn(
                "flex flex-col w-full backdrop-blur-sm bg-fd-background/80 border border-[#5865F2]/10 shadow-sm hover:shadow-md transition-all duration-300 relative",
                fullHeight ? "h-full rounded-none" : "h-[calc(100vh-12rem)]",
                "md:mt-0 mt-16", // Add top margin on mobile to account for fixed header
                "overflow-hidden" // Prevent any overflow beyond card bounds
            )}
        >
            {showNotice && (
                <div className="p-3 sm:p-4 border-b border-[#5865F2]/10 bg-[#5865F2]/5 relative z-30">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <AlertCircle className="h-4 w-4 text-[#5865F2]" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-[#5865F2]">AI Assistant</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    This AI assistant helps with CFX development. Verify critical information with official documentation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-hidden flex flex-col relative">
                <ScrollArea
                    className="flex-1 p-3 sm:p-4 overflow-y-auto"
                    style={{ scrollbarWidth: 'thin' }} // Better scrollbar on Firefox
                >
                    <div className="space-y-4 mb-4 pb-2"> {/* Added more bottom padding */}
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`rounded-lg px-4 py-2 max-w-[90vw] sm:max-w-[75%] break-words overflow-hidden ${message.role === 'user'
                                        ? 'bg-[#5865F2] text-white'
                                        : 'bg-[#2B2D31] text-white'
                                        }`}
                                >
                                    {renderMessageContent(message.content)}
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">
                                    {formatTimestamp(message.timestamp || message.createdAt?.getTime())}
                                </span>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="rounded-lg p-3 bg-gray-800/50 text-gray-100">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" /> {/* Increased height for better scrolling */}
                    </div>
                </ScrollArea>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex gap-2 p-3 sm:p-4 border-t border-[#5865F2]/10 bg-fd-background/90 backdrop-blur-md sticky bottom-0 z-40"
            >
                <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about CFX, FiveM, RedM, or txAdmin..."
                    className="flex-1 bg-gray-800/50 border-[#5865F2]/10 focus:border-[#5865F2]"
                    disabled={isLoading}
                />
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-none whitespace-nowrap"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        'Send'
                    )}
                </Button>
            </form>
        </Card>
    );
}