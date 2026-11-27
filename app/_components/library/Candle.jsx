"use client"

import { useState } from "react"

import { FLAME_FRAMES } from "@/app/_components/brand/eik-geometry"
import { sound } from "@/app/_lib/sound"

import Plank from "./Plank"
import { CANDLE, u } from "./shelf"

/*
 * A pixel candle at the end of the shelf, drawn on a 2-unit grid (13 × 19
 * cells), rows top to bottom. Its flame is the logo's flame, stepping through
 * the same three frames. Tap it to blow it out; tap again to light it.
 */
const CELL = 2
const COLS = CANDLE / CELL // 13
const FLAME_ROWS = FLAME_FRAMES[0].length // 6
const WICK = FLAME_ROWS // the wick's row, just under the flame
const BODY = [
    "XXXXX",
    "X...X",
    "X...X",
    "X...X",
    "X...X",
    "X...X",
    "X...X",
    "X...X",
    "X...X",
    "XXXXX",
]
const DISH = [".XXXXXXXXXXX.", "...XXXXXXX..."]
const ROWS = FLAME_ROWS + 1 + BODY.length + DISH.length // 19

/** Runs of X in `rows`, as rects on the grid, offset to (col, row). */
function cells(rows, col = 0, row = 0) {
    let d = ""
    rows.forEach((line, r) => {
        for (let c = 0; c < line.length; c++) {
            if (line[c] !== "X") continue
            let e = c
            while (line[e + 1] === "X") e++
            d += `M${(col + c) * CELL} ${(row + r) * CELL}h${(e - c + 1) * CELL}v${CELL}h${-(e - c + 1) * CELL}Z`
            c = e
        }
    })
    return d
}

const MID = (COLS - 5) / 2 // the 5-wide flame and body, centred
const BODY_ROW = WICK + 1
const DISH_ROW = BODY_ROW + BODY.length
const FLAME = FLAME_FRAMES.map((f) => cells(f, MID))
const OUTLINE = cells(BODY, MID, BODY_ROW)
const WAX = `M${(MID + 1) * CELL} ${(BODY_ROW + 1) * CELL}h${3 * CELL}v${(BODY.length - 2) * CELL}h${-3 * CELL}Z`
const HOLDER = cells(DISH, 0, DISH_ROW)
const WICK_D = cells(["X"], MID + 2, WICK)
// a thread of smoke for when it's blown out, curling up from the wick
const SMOKE = cells(
    ["...X.", "..X..", "..X..", ".X...", "..X..", "..X.."],
    MID,
    0,
)

export default function Candle() {
    const [lit, setLit] = useState(true)
    const [puffs, setPuffs] = useState(0) // remounts the smoke so it plays each time

    const toggle = () => {
        sound.ui(lit ? "close" : "open")
        if (lit) setPuffs((n) => n + 1)
        setLit(!lit)
    }

    return (
        <div
            className="relative shrink-0 self-end"
            style={{ width: u(CANDLE), height: u(ROWS * CELL) }}
        >
            <Plank />
            <button
                type="button"
                onClick={toggle}
                aria-pressed={lit}
                aria-label={lit ? "Blow out the candle" : "Light the candle"}
                className="group absolute inset-0 block touch-manipulation [-webkit-tap-highlight-color:transparent]"
            >
                <svg
                    viewBox={`0 0 ${CANDLE} ${ROWS * CELL}`}
                    aria-hidden
                    shapeRendering="crispEdges"
                    className="absolute inset-0 h-full w-full overflow-visible"
                >
                    <path d={WAX} className="fill-paper" />
                    <path d={OUTLINE} className="fill-ink" />
                    <path d={HOLDER} className="fill-soft" />
                    <path d={WICK_D} className="fill-ink" />
                    {lit ? (
                        <g className="eik-flame transition-transform duration-[var(--duration-quick)] group-hover:-translate-y-px">
                            {FLAME.map((d, i) => (
                                <path key={i} d={d} fill="var(--red)" />
                            ))}
                        </g>
                    ) : puffs > 0 ? (
                        <path
                            key={puffs}
                            d={SMOKE}
                            className="animate-wisp fill-faint"
                        />
                    ) : null}
                </svg>
            </button>
        </div>
    )
}
