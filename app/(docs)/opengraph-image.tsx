import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "FixFX Documentation";
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
            top: "-80px",
            left: "150px",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "200px",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            marginBottom: "24px",
            fontSize: "40px",
          }}
        >
          📚
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
              fontSize: "72px",
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
              fontSize: "72px",
              fontWeight: "800",
              color: "#f8fafc",
              marginLeft: "8px",
            }}
          >
            FX
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: "800",
              color: "#22c55e",
              marginLeft: "16px",
            }}
          >
            Docs
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: "1.4",
            margin: "0",
          }}
        >
          Comprehensive guides and tutorials for the CitizenFX ecosystem
        </p>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "32px",
          }}
        >
          {["FiveM", "RedM", "txAdmin", "vMenu"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#64748b",
                fontSize: "16px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
