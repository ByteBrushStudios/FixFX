import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
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
          "linear-gradient(to right, #0a0a0f 0%, #0d0d14 25%, #0f0f18 50%, #0d0d14 75%, #0a0a0f 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient orbs - spread horizontally for wide banner */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "200px",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "600px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "800px",
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 60%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "400px",
          width: "450px",
          height: "450px",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-120px",
          right: "150px",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Subtle gradient overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.01) 0%, transparent 50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.01) 0%, transparent 50%)",
        }}
      />
    </div>,
    {
      width: 2560,
      height: 720,
    },
  );
}
