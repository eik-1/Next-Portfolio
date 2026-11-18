import { books } from "@/app/_data/library"

/**
 * Shelf geometry and tones. Everything here is derived from the data, so the
 * shelf looks the same on the server, on the client and on every visit.
 *
 * Sizes are in shelf units. One unit is `var(--s)`, which each shelf sets from
 * its own width (see Bookshelf.jsx and ShelfPreview.jsx), so the books scale
 * with their container and never push the page sideways.
 */

const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)

/** Seeded PRNG (mulberry32): the same book always gets the same cover. */
export function seeded(seed) {
    let a = seed >>> 0
    return () => {
        a = (a + 0x6d2b79f5) >>> 0
        let t = a
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/** A length in shelf units, as CSS. */
export const u = (n) => `calc(var(--s) * ${n})`

export const GAP = 3 // between books
export const HEAD = 15 // clear cloth above the title (the bands live here)
export const FOOT = 9 // clear cloth under the author
const NAME = 9.5 // author size on the spine
const NAME_GAP = 10 // between title and author

/** Fired on `window` with a book id as `detail` to open that book from anywhere on the page. */
export const OPEN_EVENT = "library:open"

/**
 * Data tones mapped to the v3 palette. `cloth` is the binding, `type` the
 * print on it, and `hot` colours the single kept line on the cover. Blue left
 * the palette, so those editions are bound in a slightly lighter ink.
 */
export const TONES = {
    ink: { cloth: "bg-ink", type: "text-paper", hot: "text-red" },
    paper: {
        cloth: "bg-paper ring-1 ring-inset ring-line-2",
        type: "text-ink",
        hot: "text-red",
    },
    canvas: {
        cloth: "bg-tile ring-1 ring-inset ring-line-2",
        type: "text-ink",
        hot: "text-red",
    },
    sunken: {
        cloth: "bg-tile-2 ring-1 ring-inset ring-line",
        type: "text-ink",
        hot: "text-red",
    },
    red: { cloth: "bg-red", type: "text-on-red", hot: "text-on-red" },
    blue: { cloth: "bg-ink/85", type: "text-paper", hot: "text-red" },
}

const CHAR = 0.47 // average glyph advance of the serif, in em
const LEADING = 1.16

/**
 * Largest title size that fits the spine, and how many lines it needs. The
 * estimates leave slack for uneven line breaks; `needs` is the room a long
 * title asks for, so its book can grow a little rather than crowd the type.
 */
function fitTitle(title, room) {
    const run = title.length * CHAR
    if (run * 14 * 1.08 <= room) return { size: 14, lines: 1, needs: 0 }
    if (run * 13 * 1.15 <= room * 2) return { size: 13, lines: 2, needs: 0 }
    return { size: 12, lines: 3, needs: Math.ceil((run * 12 * 1.32) / 3) }
}

const surnameOf = (author) =>
    author
        .split(/\s+(?:&|and)\s+|,/)[0]
        .trim()
        .split(" ")
        .pop()

function measure(book) {
    const h = hash(book.id)
    const surname = surnameOf(book.author)
    const foot = Math.round(surname.length * NAME * 0.56) + FOOT + NAME_GAP
    const base = 164 + (h % 7) * 9
    const { size, lines, needs } = fitTitle(book.title, base - HEAD - foot)
    const height = Math.max(base, needs + HEAD + foot)
    const width = Math.max(
        28 + ((h >>> 5) % 4) * 4,
        Math.round(lines * size * LEADING + 14),
    )
    return { surname, height, width, size, lines, band: (h >>> 9) % 3 }
}

const order = { reading: 0, read: 1 }

/** Every book with its measurements, the ones being read first. */
export const SHELF = books
    .map((book) => ({ ...book, seed: hash(book.id), ...measure(book) }))
    .sort((a, b) => order[a.status] - order[b.status])

export const READING = SHELF.filter((b) => b.status === "reading").length

/** Themes in the order they were read. */
export const THEMES = books.reduce(
    (list, book) => (list.includes(book.theme) ? list : [...list, book.theme]),
    [],
)

export const TALLEST = Math.max(...SHELF.map((b) => b.height))
const WIDEST = Math.max(...SHELF.map((b) => b.width))

/** Units a container must offer for the whole shelf to stand in one row. */
export const ROW_UNITS =
    SHELF.reduce((sum, b) => sum + b.width, 0) + (SHELF.length - 1) * GAP + 2

/** The same for two rows: half the shelf, plus the one book that may not fit the first row. */
export const HALF_UNITS = Math.ceil((ROW_UNITS + WIDEST + GAP) / 2) + 2

export const NAME_SIZE = NAME
export const LINE_HEIGHT = LEADING
