import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FixFX - FiveM & RedM Documentation Hub",
    short_name: "FixFX",
    description:
      "Comprehensive guides, tutorials, and documentation for FiveM, RedM, txAdmin, and the CitizenFX ecosystem.",
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    dir: "ltr",
    categories: ["documentation", "education", "developer tools", "games"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/txadmin/welcome.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
        label: "FixFX Documentation Homepage",
      },
    ],
  };
}
