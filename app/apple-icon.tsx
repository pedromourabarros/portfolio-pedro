import { ImageResponse } from "next/og"

export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(140deg, #16b3a6 0%, #0c6f68 100%)",
          borderRadius: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 122,
            fontWeight: 800,
            color: "#04121a",
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          P
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 32,
            display: "flex",
            alignItems: "flex-end",
            gap: 9,
          }}
        >
          <div style={{ width: 10, height: 16, background: "#04121a", opacity: 0.55, borderRadius: 3 }} />
          <div style={{ width: 10, height: 28, background: "#04121a", opacity: 0.7, borderRadius: 3 }} />
          <div style={{ width: 10, height: 44, background: "#04121a", opacity: 0.85, borderRadius: 3 }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
