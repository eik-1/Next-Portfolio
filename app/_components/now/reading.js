import { books } from "@/app/_data/library"

/** Books with status "reading", in data order. Falls back to the latest book so nothing renders empty. */
const current = books.filter((b) => b.status === "reading")
export const reading = current.length ? current : books.slice(-1)

/**
 * Library `spine` tones mapped onto the v3 palette.
 *   face  — a cover surface: fill, text colour and the hairline around it
 *   board — the edge of the cover boards where the page block shows
 */
const TONES = {
    ink: { face: "border-paper/25 bg-ink text-paper", board: "bg-ink" },
    paper: { face: "border-line-2 bg-paper text-ink", board: "bg-line-2" },
    canvas: { face: "border-line-2 bg-tile-2 text-ink", board: "bg-line-2" },
    sunken: { face: "border-line-2 bg-tile-2 text-ink", board: "bg-line-2" },
    red: { face: "border-on-red/30 bg-red text-on-red", board: "bg-red" },
    blue: { face: "border-paper/25 bg-ink text-paper", board: "bg-ink" },
}

export const toneOf = (book) => TONES[book?.spine] ?? TONES.ink
