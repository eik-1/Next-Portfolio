import { cn } from "@/app/_lib/cn"

import { EIK } from "./eik-geometry"
import Flame from "./Flame"

/**
 * The eik wordmark (v3): Newsreader letterforms with a small red pixel flame for the i's dot.
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
                <Flame />
            </g>
        </svg>
    )
}
