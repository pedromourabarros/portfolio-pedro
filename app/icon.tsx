import { ImageResponse } from "next/og"

export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 3,
          }}
        >
          <div style={{ width: 4, height: 9, background: "#1fb6a8", borderRadius: 1 }} />
          <div style={{ width: 4, height: 15, background: "#22d3c5", borderRadius: 1 }} />
          <div style={{ width: 4, height: 21, background: "#5eead4", borderRadius: 1 }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
