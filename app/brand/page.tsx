"use client";

import { FixFXIcon } from "@ui/icons";
import { Download } from "lucide-react";

export default function BrandPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f18] px-4 py-12 sm:py-16">
      {/* Background gradient orbs - adjusted for mobile */}
      <div className="absolute top-[-100px] left-0 sm:left-[200px] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)] rounded-full" />
      <div className="absolute bottom-[-50px] right-0 sm:right-[150px] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-[radial-gradient(circle,rgba(139,92,246,0.25)_0%,transparent_70%)] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_60%)] rounded-full" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 w-full max-w-2xl">
        {/* Icon */}
        <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-fd-card/30 backdrop-blur-sm border border-fd-border/50">
          <FixFXIcon className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64" stroke="#f8fafc" />
        </div>

        {/* Title */}
        <div className="flex items-center">
          <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Fix
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-fd-foreground ml-1 sm:ml-2">
            FX
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-fd-muted-foreground text-base sm:text-lg text-center max-w-md px-4">
          Your comprehensive resource for FiveM, RedM, and the CitizenFX ecosystem.
        </p>

        {/* Brand Guidelines */}
        <div className="w-full mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl bg-fd-card/20 backdrop-blur-sm border border-fd-border/30">
          <h2 className="text-lg sm:text-xl font-semibold text-fd-foreground mb-4 text-center">Brand Guidelines</h2>
          
          {/* Color Palette */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-fd-muted-foreground mb-3">Primary Colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-12 sm:h-16 rounded-lg bg-blue-600 border border-fd-border/30" />
                <span className="text-xs text-fd-muted-foreground">#2563EB</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-12 sm:h-16 rounded-lg bg-blue-500 border border-fd-border/30" />
                <span className="text-xs text-fd-muted-foreground">#3B82F6</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-12 sm:h-16 rounded-lg bg-cyan-500 border border-fd-border/30" />
                <span className="text-xs text-fd-muted-foreground">#06B6D4</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-12 sm:h-16 rounded-lg bg-[#0a0a0f] border border-fd-border/50" />
                <span className="text-xs text-fd-muted-foreground">#0A0A0F</span>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-fd-muted-foreground mb-3">Typography</h3>
            <div className="p-3 sm:p-4 rounded-lg bg-fd-background/50 border border-fd-border/30">
              <p className="text-sm text-fd-foreground">
                <span className="font-semibold">Font Family:</span> Inter, system-ui, sans-serif
              </p>
              <p className="text-sm text-fd-foreground mt-2">
                <span className="font-semibold">Logo Text:</span> &quot;Fix&quot; in gradient, &quot;FX&quot; in foreground
              </p>
            </div>
          </div>

          {/* Usage Notes */}
          <div>
            <h3 className="text-sm font-medium text-fd-muted-foreground mb-3">Usage Notes</h3>
            <ul className="text-sm text-fd-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Use the icon on dark backgrounds for best visibility
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Maintain minimum padding around the logo
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                Do not distort or rotate the logo
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                Do not change the gradient colors
              </li>
            </ul>
          </div>
        </div>

        {/* Download buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 w-full sm:w-auto">
          <a
            href="/icon.png"
            download="fixfx-icon-512.png"
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium hover:bg-fd-primary/90 transition-colors text-sm sm:text-base"
          >
            <Download className="h-4 w-4" />
            Download Icon (512px)
          </a>
          <a
            href="/apple-icon.png"
            download="fixfx-icon-180.png"
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-lg bg-fd-secondary text-fd-secondary-foreground font-medium hover:bg-fd-secondary/80 transition-colors text-sm sm:text-base"
          >
            <Download className="h-4 w-4" />
            Download Icon (180px)
          </a>
        </div>

        {/* SVG Download */}
        <p className="text-xs text-fd-muted-foreground text-center">
          Need a different format? <a href="mailto:contact@fixfx.dev" className="text-fd-primary hover:underline">Contact us</a> for SVG or other formats.
        </p>
      </div>
    </div>
  );
}
