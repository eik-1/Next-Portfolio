import { EIK } from "./eik-geometry"

/**
 * The red pixel flame over the i, in the wordmark's font units (place it inside
 * the `scale(1 -1)` group). Its three frames are stacked and stepped through in
 * CSS (`.eik-flame` in globals.css), so it flickers without any JS. With
 * reduced motion only frame 0 shows.
 */
export default function Flame({ className }) {
    return (
        <g className={["eik-flame", className].filter(Boolean).join(" ")}>
            {EIK.flame.map((d, i) => (
                <path key={i} d={d} fill="var(--red)" />
            ))}
        </g>
    )
}
