import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "56px",
          background: "linear-gradient(135deg, #1f2937 0%, #0f766e 100%)",
          color: "#f8fafc",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: "28px", marginBottom: "16px", opacity: 0.85 }}>
          Oliotya Uganda Safaris
        </div>
        <div style={{ fontSize: "64px", lineHeight: 1.1, fontWeight: 700, maxWidth: "920px" }}>
          Explore the Pearl of Africa
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
