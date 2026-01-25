import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Fixie - AI Assistant',
    description: 'Your intelligent AI assistant for the CitizenFX ecosystem. Get help with FiveM, RedM, txAdmin, server configuration, Lua scripting, and more.',
    keywords: ['FiveM', 'RedM', 'txAdmin', 'CitizenFX', 'AI Assistant', 'Lua', 'Server Development'],
};

export default function AskLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 