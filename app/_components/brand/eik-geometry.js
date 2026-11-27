/**
 * The i's dot is a small red pixel flame: 5 × 6 cells of 46 units, centred on
 * the x where Newsreader draws its own dot, its base a little above the stem.
 * Three frames; the logo steps between them (never tweens) so it flickers
 * like a pixel candle. Rows are listed top to bottom.
 */
const FLAME_CELL = 46
const FLAME_BASE = 1180
const FLAME_CENTRE = 1212
export const FLAME_FRAMES = [
    ["..X..", "..XX.", ".XXX.", "XXXXX", "XXXXX", ".XXX."], // at rest, tip curling right
    [".X...", ".XX..", ".XXX.", "XXXXX", "XXXXX", ".XXX."], // leaning left
    [".....", "...X.", "..XX.", "XXXX.", "XXXXX", ".XXX."], // ducking low
]

/** One frame as a path in font units (y-up), each row's runs merged into one rect. */
function flamePath(rows) {
    const x0 = FLAME_CENTRE - (rows[0].length * FLAME_CELL) / 2
    let d = ""
    ;[...rows].reverse().forEach((row, r) => {
        const y = FLAME_BASE + r * FLAME_CELL
        for (let c = 0; c < row.length; c++) {
            if (row[c] !== "X") continue
            let e = c
            while (row[e + 1] === "X") e++
            const w = (e - c + 1) * FLAME_CELL
            d += `M${x0 + c * FLAME_CELL} ${y}h${w}v${FLAME_CELL}h${-w}Z`
            c = e
        }
    })
    return d
}

/**
 * eik wordmark v3 (DESIGN.md · 0 Logo). Newsreader (opsz 72, 400) outlines in
 * font units, y-up, baseline 0. The i's dot is replaced by a red pixel flame
 * (`flame`, frame 0 is the still one).
 */
export const EIK = {
    viewBox: "-10 -1494 2637.0 1524",
    e: "M554 1044Q659 1044 737.0 1000.5Q815 957 861.0 872.5Q907 788 916 664H254V722H806L728 682Q718 790 692.5 859.0Q667 928 625.5 961.5Q584 995 524 995Q443 995 385.0 948.0Q327 901 296.0 811.5Q265 722 265 595Q265 428 308.5 323.5Q352 219 435.0 171.0Q518 123 637 123Q692 123 745.0 138.0Q798 153 844.5 183.0Q891 213 924 258L940 247Q878 148 815.5 89.5Q753 31 684.5 5.5Q616 -20 535 -20Q405 -20 300.5 38.5Q196 97 135.5 211.5Q75 326 75 494Q75 643 131.5 768.0Q188 893 295.5 968.5Q403 1044 554 1044Z",
    i: "M376 1055V860V57L519 27V0H49V27L192 57V856Q181 863 159.0 877.0Q137 891 108.5 909.0Q80 927 49 946V964L372 1055Z",
    iX: 946.0,
    k: "M462 594 504 637 1045 56 1158 27V0H678V27L815 54L366 536H324V582H377L848 960L701 991V1024H1085V991L938 958ZM359 57 502 27V0H32V27L175 57V1315Q162 1321 138.5 1331.5Q115 1342 83.0 1356.5Q51 1371 12 1389V1407L355 1484H359V1320Z",
    kX: 1459.0,
    flame: FLAME_FRAMES.map(flamePath),
}
