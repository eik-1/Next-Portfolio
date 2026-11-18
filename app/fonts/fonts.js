import localFont from "next/font/local"
import { Newsreader } from "next/font/google"

/**
 * Type: "paper and pixels".
 *  serif — Newsreader (opsz). The voice: names, intro, paragraphs, titles.
 *  sans  — Geist. Small UI: nav, labels, buttons, captions.
 *  pixel — Departure Mono (MIT). Live data only: clock, now playing, counts.
 */

const serif = Newsreader({
    subsets: ["latin"],
    style: ["normal", "italic"],
    axes: ["opsz"],
    variable: "--font-serif-face",
    display: "swap",
})

const sans = localFont({
    src: "./GeistVF.woff",
    weight: "100 900",
    variable: "--font-sans-face",
    display: "swap",
})

const pixel = localFont({
    src: "./DepartureMono-Regular.woff2",
    weight: "400",
    variable: "--font-pixel-face",
    display: "swap",
})

export const fontVariables = [serif, sans, pixel]
    .map((f) => f.variable)
    .join(" ")
