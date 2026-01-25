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
          fontSize: 128,
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          gap: "20px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#5865f2",
            textAlign: "center",
          }}
        >
          FixFX Docs
        </div>
        <div
          style={{
            fontSize: 48,
            color: "#a8b5ff",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Comprehensive guides and information for the CitizenFX ecosystem
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
