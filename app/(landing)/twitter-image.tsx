import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "FixFX - Your FiveM & RedM Resource Hub";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
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
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
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
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Main title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              fontSize: "96px",
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
              fontSize: "96px",
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
            fontSize: "28px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0",
          }}
        >
          FiveM & RedM Resource Hub
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
