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
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 60%)",
            borderRadius: "50%",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "9999px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            background: "rgba(59, 130, 246, 0.1)",
            marginBottom: "24px",
          }}
        >
          <div style={{ fontSize: "20px" }}>✨</div>
          <span style={{ color: "#3b82f6", fontSize: "18px", fontWeight: "500" }}>
            Open Source Documentation
          </span>
        </div>

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
            lineHeight: "1.4",
            margin: "0",
          }}
        >
          Your comprehensive resource for <span style={{ color: "#f8fafc", fontWeight: "500" }}>FiveM</span>,{" "}
          <span style={{ color: "#f8fafc", fontWeight: "500" }}>RedM</span>, and the{" "}
          <span style={{ color: "#f8fafc", fontWeight: "500" }}>CitizenFX</span> ecosystem.
        </p>

        {/* Bottom indicators */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            marginTop: "48px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
            <span style={{ color: "#64748b", fontSize: "16px" }}>Free & Open Source</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#3b82f6",
              }}
            />
            <span style={{ color: "#64748b", fontSize: "16px" }}>Community Driven</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#a855f7",
              }}
            />
            <span style={{ color: "#64748b", fontSize: "16px" }}>Always Updated</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
