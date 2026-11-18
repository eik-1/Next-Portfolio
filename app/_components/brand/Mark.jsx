import { cn } from "@/app/_lib/cn"

import { EIK } from "./eik-geometry"

/**
 * The eik wordmark (v3): Newsreader letterforms with a red pixel for the i's dot.
 * Size it with a height class (e.g. "h-5"); width follows. Ink = currentColor.
 */
export default function Mark({ className, title = "eik" }) {
    return (
        <svg
            viewBox={EIK.viewBox}
            className={cn("block h-5 w-auto", className)}
            role="img"
            aria-label={title}
            fill="currentColor"
        >
            <g transform="scale(1 -1)">
                <path d={EIK.e} />
                <path transform={`translate(${EIK.iX} 0)`} d={EIK.i} />
                <path transform={`translate(${EIK.kX} 0)`} d={EIK.k} />
                <rect
                    x={EIK.pixel.x}
                    y={EIK.pixel.y}
                    width={EIK.pixel.size}
                    height={EIK.pixel.size}
                    fill="var(--red)"
                />
            </g>
        </svg>
    )
}
