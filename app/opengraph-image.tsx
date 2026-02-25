import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #0b3a3f 100%)",
          color: "#f8fafc",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "32px",
            border: "1px solid rgba(248,250,252,0.22)",
            borderRadius: "24px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
            fontSize: "26px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#cbd5e1",
          }}
        >
          Oliotya Uganda Safaris
        </div>

        <div
          style={{
            fontSize: "66px",
            fontWeight: 700,
            lineHeight: 1.08,
            maxWidth: "980px",
          }}
        >
          Discover Uganda&apos;s Wild Beauty
        </div>

        <div
          style={{
            marginTop: "20px",
            fontSize: "30px",
            color: "#e2e8f0",
            maxWidth: "860px",
          }}
        >
          Gorilla trekking, wildlife safaris, and curated adventures.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
