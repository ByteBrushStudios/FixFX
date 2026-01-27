import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "FixFX Artifacts - FiveM & RedM Server Builds";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(to bottom right, #0a0a0f 0%, #0d0d14 50%, #0f0f18 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient orb */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 60%)",
          borderRadius: "50%",
        }}
      />

      {/* Icon */}
      <div
        style={{
          fontSize: "48px",
          marginBottom: "20px",
        }}
      >
        📦
      </div>

      {/* Main title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <span
          style={{
            fontSize: "64px",
            fontWeight: "800",
            background: "linear-gradient(to right, #2563eb, #3b82f6, #06b6d4)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Fix
        </span>
        <span
          style={{
            fontSize: "64px",
            fontWeight: "800",
            color: "#f8fafc",
            marginLeft: "8px",
          }}
        >
          FX
        </span>
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "32px",
          color: "#3b82f6",
          fontWeight: "600",
          margin: "0",
        }}
      >
        Artifacts
      </p>
    </div>,
    {
      ...size,
    },
  );
}
