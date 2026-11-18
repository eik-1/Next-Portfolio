/**
 * Tiny 1-bit drawings for the Now family, authored as ASCII bitmaps and
 * rendered as one crisp SVG path each. They take `currentColor`.
 */

function toPath(rows, cell = 1, gap = 0) {
    const step = cell + gap
    let d = ""
    rows.forEach((row, y) => {
        // Merge horizontal runs so the path stays short and seamless.
        let x = 0
        while (x < row.length) {
            if (row[x] !== "#") {
                x++
                continue
            }
            let end = x
            while (gap === 0 && row[end + 1] === "#") end++
            d += `M${x * step} ${y * step}h${(end - x) * step + cell}v${cell}h${-((end - x) * step + cell)}z`
            x = end + 1
        }
    })
    return d
}

const SUN = [
    ".....#.....",
    ".....#.....",
    "..#.....#..",
    "....###....",
    "...#####...",
    "##.#####.##",
    "...#####...",
    "....###....",
    "..#.....#..",
    ".....#.....",
    ".....#.....",
]

const MOON = [
    "....###....",
    "..###......",
    ".###.......",
    ".###.......",
    "###........",
    "###........",
    "###.......#",
    ".###.....##",
    ".####...##.",
    "..#######..",
    "....####...",
]

/**
 * India on a 20 × 20 grid (≈ 1.5° per cell, 68°E–97.5°E · 37°N–8°N).
 * Simplified by hand from the outline: Kashmir on top, the Gujarat nub on the
 * left, the north-east arm on the right, tapering to Kanyakumari.
 */
const INDIA = [
    "...####.............",
    "...######...........",
    "....#####...........",
    "....####............",
    "....#####...........",
    "...######.........##",
    "..#########..#..####",
    ".##################.",
    "..############..###.",
    "##############..##..",
    ".#############..#...",
    "...##########.......",
    "...#########........",
    "....#######.........",
    "....######..........",
    "....#####...........",
    ".....####...........",
    ".....###............",
    "......##............",
    "......#.............",
]

const SUN_D = toPath(SUN)
const MOON_D = toPath(MOON)

const CELL = 3
const GAP = 1
const INDIA_D = toPath(INDIA, CELL, GAP)
const INDIA_SIZE = INDIA.length * (CELL + GAP) - GAP

function Glyph({ d, size = 11, className }) {
    return (
        <svg
            viewBox="0 0 11 11"
            width={size}
            height={size}
            fill="currentColor"
            shapeRendering="crispEdges"
            aria-hidden="true"
            className={className}
        >
            <path d={d} />
        </svg>
    )
}

export function Sun(props) {
    return <Glyph d={SUN_D} {...props} />
}

export function Moon(props) {
    return <Glyph d={MOON_D} {...props} />
}

/**
 * Dot-matrix India with one red cell. `pin` is { row, col } on the 20 × 20
 * grid; the default sits on Delhi (28.6°N 77.2°E). Move it to wherever home is.
 */
export function IndiaMap({ pin = { row: 5, col: 6 }, className }) {
    return (
        <svg
            viewBox={`0 0 ${INDIA_SIZE} ${INDIA_SIZE}`}
            width={INDIA_SIZE}
            height={INDIA_SIZE}
            shapeRendering="crispEdges"
            aria-hidden="true"
            className={className}
        >
            <path d={INDIA_D} fill="currentColor" />
            <rect
                x={pin.col * (CELL + GAP)}
                y={pin.row * (CELL + GAP)}
                width={CELL}
                height={CELL}
                className="fill-red"
            />
        </svg>
    )
}
