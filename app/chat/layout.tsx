import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Fixie',
    description: 'Your ultimate AI assistant for the CitizenFX ecosystem.',
};

export default function AskLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 