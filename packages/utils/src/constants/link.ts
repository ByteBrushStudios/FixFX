import { HomeIcon, BookOpen, CodeIcon, FileCode2, MessageSquare } from 'lucide-react';

export const ENV_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://fixfx.wiki";
export const DISCORD_LINK = "https://discord.gg/Vv2bdC44Ge";
export const GITHUB_ORG = "https://github.com/ByteBrushStudios";
export const GITHUB_LINK = "https://github.com/ByteBrushStudios/FixFX";
export const DOCS_URL = "https://fixfx.wiki";

export const GIT_OWNER = "ByteBrushStudios";
export const GIT_REPO = "FixFX";
export const GIT_SHA = "master";

export const NAV_LINKS = [
    {
        name: "Home",
        href: "/",
        icon: HomeIcon,
        external: false
    },
    {
        name: "Documentation",
        href: "/docs",
        icon: BookOpen,
        external: false
    },
    {
        name: "Natives",
        href: "/natives",
        icon: CodeIcon,
        external: false
    },
    {
        name: "Artifacts",
        href: "/artifacts",
        icon: FileCode2,
        external: false
    },
    {
        name: "Chat",
        href: "/chat",
        icon: MessageSquare,
        external: false
    }
];