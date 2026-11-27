import { ImageResponse } from "next/og"

import { EIK } from "@/app/_components/brand/eik-geometry"

export const dynamic = "force-static"
export const alt = "Sarthak Rawat"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
    const [, , vw, vh] = EIK.viewBox.split(" ").map(Number)
    const h = 220
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "#fbfbf9",
                color: "#1a1a18",
                padding: 80,
            }}
        >
            <svg width={(vw / vh) * h} height={h} viewBox={EIK.viewBox}>
                <g transform="scale(1 -1)" fill="#1a1a18">
                    <path d={EIK.e} />
                    <path transform={`translate(${EIK.iX} 0)`} d={EIK.i} />
                    <path transform={`translate(${EIK.kX} 0)`} d={EIK.k} />
                    <path d={EIK.flame[0]} fill="#e5392e" />
                </g>
            </svg>
            <div style={{ display: "flex", fontSize: 40, color: "#64635d" }}>
                Sarthak Rawat · software engineer in India
            </div>
        </div>,
        size,
    )
}
