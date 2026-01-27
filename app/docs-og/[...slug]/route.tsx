import { metadataImage } from "@/lib/docs/metadata";
import { ImageResponse } from "next/og";
import React from "react";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export const GET = metadataImage.createAPI(async (page: any) => {
  // Truncate description to prevent overflow
  const maxDescLength = 150;
  const description = page.data.description 
    ? page.data.description.length > maxDescLength
      ? page.data.description.substring(0, maxDescLength).trim() + "..."
      : page.data.description
    : "";

  // Read the logo from the filesystem
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoBuffer = fs.readFileSync(logoPath);
  const logoData = logoBuffer.buffer.slice(logoBuffer.byteOffset, logoBuffer.byteOffset + logoBuffer.byteLength);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: "linear-gradient(to bottom right, #0a0a0f 0%, #0d0d14 50%, #0f0f18 100%)",
          position: "relative",
          overflow: "hidden",
          padding: "60px 80px",
        }}
      >
        {/* Background gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "200px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            right: "150px",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Header with logo and site name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            zIndex: 10,
          }}
        >
          <img
            // @ts-ignore
            src={logoData as any}
            alt="Logo"
            width="64"
            height="64"
            style={{
              borderRadius: "12px",
            }}
          />
          <span
            style={{
              fontSize: "48px",
              fontWeight: 800,
              background: "linear-gradient(to right, #3b82f6, #06b6d4)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            FixFX
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "1100px",
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: "100px",
              fontWeight: 900,
              background: "linear-gradient(to bottom right, #ffffff 30%, #94a3b8 100%)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.0,
              margin: 0,
              letterSpacing: "-0.04em",
            }}
          >
            {page.data.title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: "32px",
                fontWeight: 400,
                color: "#94a3b8",
                lineHeight: 1.4,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {description}
            </p>
          )}
        </div>


      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
});

export function generateStaticParams() {
  return [];
}
