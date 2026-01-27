import { ImageResponse } from "next/og";
import React from "react";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "FixFX Hosting Partners - Trusted Game Server Hosting";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  // Read the logo from the filesystem
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoBuffer = fs.readFileSync(logoPath);
  const logoData = logoBuffer.buffer.slice(
    logoBuffer.byteOffset,
    logoBuffer.byteOffset + logoBuffer.byteLength
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #0a0a0f 0%, #0d0d14 50%, #0f0f18 100%)",
          position: "relative",
          overflow: "hidden",
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
            background: "radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)",
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
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <img
            // @ts-ignore
            src={logoData as any}
            alt="Logo"
            width="48"
            height="48"
            style={{
              borderRadius: "10px",
            }}
          />
          <span
            style={{
              fontSize: "32px",
              fontWeight: 800,
              background: "linear-gradient(to right, #22c55e, #10b981)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            FixFX
          </span>
        </div>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 24px",
            borderRadius: "9999px",
            border: "1px solid rgba(34, 197, 94, 0.4)",
            background: "rgba(34, 197, 94, 0.1)",
            marginBottom: "32px",
          }}
        >
          <span style={{ fontSize: "24px" }}>🤝</span>
          <span style={{ color: "#22c55e", fontSize: "20px", fontWeight: "600" }}>
            Official Partners
          </span>
        </div>

        {/* Main title */}
        <h1
          style={{
            fontSize: "100px",
            fontWeight: 900,
            background: "linear-gradient(to right, #22c55e, #10b981, #3b82f6)",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            margin: "0 0 24px 0",
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
          }}
        >
          Hosting Partners
        </h1>

        {/* Subtitle with fixed spacing */}
        <p
          style={{
            fontSize: "34px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: "1.4",
            margin: "0",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span>Trusted hosting providers for your</span>
          <span style={{ color: "#f8fafc", fontWeight: "600", margin: "0 12px" }}>FiveM</span>
          <span>and</span>
          <span style={{ color: "#f8fafc", fontWeight: "600", margin: "0 12px" }}>RedM</span>
          <span>servers</span>
        </p>

        {/* Bottom indicators */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "48px",
            marginTop: "60px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ color: "#64748b", fontSize: "18px", fontWeight: 500 }}>Exclusive Discounts</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#3b82f6" }} />
            <span style={{ color: "#64748b", fontSize: "18px", fontWeight: 500 }}>High Performance</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#a855f7" }} />
            <span style={{ color: "#64748b", fontSize: "18px", fontWeight: 500 }}>24/7 Support</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
