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
          background: "#0a0e14",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 16,
          }}
        >
          <div style={{ width: 22, height: 50, background: "#1fb6a8", borderRadius: 6 }} />
          <div style={{ width: 22, height: 84, background: "#22d3c5", borderRadius: 6 }} />
          <div style={{ width: 22, height: 118, background: "#5eead4", borderRadius: 6 }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
