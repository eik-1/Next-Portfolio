import { cn } from "@/app/_lib/cn"

import { seeded, TONES } from "./shelf"

const r2 = (n) => Math.round(n * 100) / 100

const ROWS = 7
const PITCH = 6.5

/**
 * The mark on every cover: a small page of set type, drawn from the book's
 * seed, with the one line I kept picked out. A book I'm still reading has
 * only its first lines, and nothing kept yet.
 */
function KeptLine({ seed, kept, hot, className }) {
    const rnd = seeded(seed)
    const keep = 1 + Math.floor(rnd() * (ROWS - 2))
    const rows = Array.from({ length: ROWS }, (_, r) => {
        const reach = r === ROWS - 1 ? 30 + rnd() * 32 : 80 + rnd() * 20
        const words = []
        let x = 0
        while (x < reach - 5) {
            const w = Math.min(5 + rnd() * 13, reach - x)
            words.push({ x: r2(x), w: r2(w) })
            x += w + 2.6
        }
        return words
    })
    const shown = kept ? rows : rows.slice(0, 3)
    return (
        <svg
            aria-hidden
            viewBox={`0 0 100 ${ROWS * PITCH}`}
            fill="currentColor"
            className={cn("block w-full", className)}
        >
            {shown.map((words, r) => (
                <g
                    key={r}
                    className={kept && r === keep ? hot : undefined}
                    opacity={kept && r === keep ? 1 : 0.28}
                >
                    {words.map((word) => (
                        <rect
                            key={word.x}
                            x={word.x}
                            y={r * PITCH + 2.5}
                            width={word.w}
                            height="1.5"
                            rx="0.75"
                        />
                    ))}
                </g>
            ))}
        </svg>
    )
}

/** Title size in cqw: as large as the title's length and its longest word allow. */
function titleSize(title) {
    const len = title.length
    const cap = len <= 12 ? 13.5 : len <= 20 ? 11.5 : len <= 30 ? 10 : 8.5
    const longest = Math.max(...title.split(" ").map((w) => w.length))
    return Math.min(cap, r2(158 / longest))
}

/**
 * The typographic cover: title, author, and the page with the kept line. It
 * draws no background of its own; the cloth is a separate layer so it can fly
 * out of the spine.
 */
export default function BookCover({ book, titleId, className }) {
    const tone = TONES[book.spine]
    return (
        <div className={cn("@container h-full w-full", tone.type, className)}>
            <div className="flex h-full flex-col p-[9cqw]">
                <h2
                    id={titleId}
                    className="font-serif leading-[1.08] tracking-tight text-balance"
                    style={{ fontSize: `${titleSize(book.title)}cqw` }}
                >
                    {book.title}
                </h2>
                <p className="mt-[4.5cqw] font-sans text-[max(10px,5cqw)] leading-[1.35] opacity-70">
                    {book.author}
                </p>
                <KeptLine
                    seed={book.seed}
                    kept={Boolean(book.quote)}
                    hot={tone.hot}
                    className="mt-auto"
                />
            </div>
        </div>
    )
}
