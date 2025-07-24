import type { HomeLayoutProps } from "fumadocs-ui/layouts/home";
import { GITHUB_LINK, DISCORD_LINK } from "@/packages/utils/src";
import { FixFXIcon } from "@ui/icons";
import { FaDiscord } from "react-icons/fa";
import { Gamepad, Home, PlugZap, LogsIcon, Bot } from "lucide-react";

export const baseOptions: HomeLayoutProps = {
  disableThemeSwitch: true,
  githubUrl: `${GITHUB_LINK}`,
  nav: {
    title: (
      <div className="flex flex-row items-center justify-center gap-x-2">
        <FixFXIcon className="size-6" />
        <p className="font-sans text-lg">FixFX</p>
      </div>
    ),
  },
  links: [
    {
      type: "icon",
      text: "",
      icon: <FaDiscord className="size-6" />,
      url: "https://discord.gg/saK4hyXxMN",
    },
    {
      type: "main",
      text: "Home",
      icon: <Home className="size-6" />,
      url: "/"
    },
    {
      type: "menu",
      text: "Blog",
      url: "/blog",
      items: [
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Welcome to FixFX
                </h1>
              </div>
            ),
          },
          icon: <FixFXIcon className="size-6" />,
          text: "Introduction",
          description:
            "Welcome to FixFX, your comprehensive resource for CitizenFX.",
          url: "/blog/welcome",
        },
      ],
    },
    {
      type: "menu",
      text: "Documentation",
      url: "/docs/core",
      items: [
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-8" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Core Documentation
                </h1>
              </div>
            ),
          },
          icon: <FixFXIcon className="size-6" />,
          text: "FixFX Core",
          description:
            "Some information about FixFX.",
          url: "/docs/core",
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-8" stroke="#2563eb" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  CitizenFX Documentation
                </h1>
              </div>
            ),
          },
          icon: <FixFXIcon className="size-6" stroke="#2563eb" />,
          text: "CitizenFX Ecosystem",
          description:
            "Explore some guides and information about the CitizenFX ecosystem.",
          url: "/docs/cfx",
        },
      ],
    },
    {
      type: "menu",
      text: "Resources",
      items: [
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-6" stroke="#2365eb" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Fixie
                </h1>
              </div>
            )
          },
          icon: <Bot className="size-6" stroke="#2365eb" />,
          text: "Chat with Fixie",
          description: "Fixie is a powerful AI assistant that can help you with all your CFX needs.",
          url: "/chat"
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-6" stroke="#94865b" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Natives
                </h1>
              </div>
            )
          },
          icon: <Gamepad className="size-6" stroke="#94865b" />,
          text: "Game Natives",
          description: "Explore the natives for CFX, GTAV and RDR2 and their use cases.",
          url: "/natives"
        },
        {
          menu: {
            banner: (
              <div className="flex h-20 w-full items-center justify-center gap-x-1">
                <FixFXIcon className="size-6" stroke="#79143b" />
                <h1 className="text-fd-foreground text-2xl font-bold">
                  Artifacts
                </h1>
              </div>
            )
          },
          icon: <PlugZap className="size-6" stroke="#79143b" />,
          text: "Server Artifacts",
          description: "Explore the latest server artifacts for CFX.",
          url: "/artifacts"
        }
      ]
    }
  ],
};
