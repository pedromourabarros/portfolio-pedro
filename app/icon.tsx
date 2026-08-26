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
          background: "linear-gradient(140deg, #16b3a6 0%, #0c6f68 100%)",
          borderRadius: 8,
          position: "relative",
        }}
      >
        {/* Monograma P */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#04121a",
            lineHeight: 1,
            letterSpacing: -1,
          }}
        >
          P
        </div>
        {/* Sparkline ascendente na base (remete a dados) */}
        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: 5,
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
          }}
        >
          <div style={{ width: 2, height: 3, background: "#04121a", opacity: 0.55, borderRadius: 1 }} />
          <div style={{ width: 2, height: 5, background: "#04121a", opacity: 0.7, borderRadius: 1 }} />
          <div style={{ width: 2, height: 8, background: "#04121a", opacity: 0.85, borderRadius: 1 }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
