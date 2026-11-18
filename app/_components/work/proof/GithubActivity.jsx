"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useId, useRef, useState } from "react"

import github from "@/app/_data/github.json"
import { cn } from "@/app/_lib/cn"
import { ease } from "@/app/_lib/motion"

import {
    contributions,
    count,
    dayMonthYear,
    longDate,
    parseDay,
    weekdayDayMonth,
} from "./format"

// The grid is drawn in "pixels": a day is a 4×4 block with a one-pixel gutter.
// One pixel is `--u` CSS px (2, or 3 when the tile is wide), so every dither
// dot lands on whole device pixels.
const CELL = 4
const PITCH = CELL + 1
const COLS = github.weeks.length
const W = COLS * PITCH - 1
const H = 7 * PITCH - 1
const PRINT_MS = 600

// 1-bit dither: which pixels of the 4×4 block are inked at each level.
const SPARSE = [
    [0, 0],
    [2, 0],
    [1, 2],
    [3, 2],
]
const CHECKER = [0, 1, 2, 3].flatMap((y) =>
    [0, 1, 2, 3].filter((x) => (x + y) % 2 === 0).map((x) => [x, y]),
)

const box = (x, y, w = 1, h = w) => `M${x} ${y}h${w}v${h}h${-w}z`

// Every day in date order, with its place on the grid (c = week, r = weekday).
const DAYS = github.weeks.flatMap((week, c) =>
    week.map(([date, n]) => ({ date, n, c, r: parseDay(date).wd })),
)
const LAST = DAYS.length - 1
const MAX = Math.max(1, ...DAYS.map((d) => d.n))
const BUSIEST = DAYS.findLast((d) => d.n === MAX && d.n > 0) ?? null
const ACTIVE_DAYS = DAYS.filter((d) => d.n > 0).length
const SLOT = new Map(DAYS.map((d, k) => [d.c * 7 + d.r, k]))

function level(n) {
    if (n === 0) return 0
    if (n <= MAX * 0.25) return 1
    return n <= MAX * 0.5 ? 2 : 3
}

// One set of paths per week, so a week can be "printed" as a unit.
const COLUMNS = github.weeks.map((_, c) => {
    const paths = { off: "", ink: "", red: "" }
    for (const day of DAYS) {
        if (day.c !== c) continue
        const x = c * PITCH
        const y = day.r * PITCH
        const l = level(day.n)
        if (day === BUSIEST) paths.red += box(x, y, CELL)
        else if (l === 0) paths.off += box(x + 1, y + 1, 2)
        else if (l === 3) paths.ink += box(x, y, CELL)
        else
            for (const [dx, dy] of l === 1 ? SPARSE : CHECKER)
                paths.ink += box(x + dx, y + dy)
    }
    return paths
})

// A month's initial sits over the first week that starts in it.
const MONTH_INITIALS = "JFMAMJJASOND"
const MONTH_MARKS = github.weeks
    .map((week, c) => ({ c, m: parseDay(week[0][0]).m }))
    .filter((mark, c, all) => c === 0 || mark.m !== all[c - 1].m)
    .filter((mark, i, all) => mark.c > 0 || !all[1] || all[1].c > 1)

const WEEKDAY_MARKS = [
    ["M", 1],
    ["W", 3],
    ["F", 5],
]

/** How many of the oldest weeks are clipped away because the tile is narrow. */
function firstVisibleColumn(strip) {
    const u = parseFloat(getComputedStyle(strip).getPropertyValue("--u")) || 2
    return Math.max(0, COLS - Math.floor((strip.clientWidth + u) / (PITCH * u)))
}

/**
 * A year of GitHub contributions as a 1-bit pixel grid: weeks run left to
 * right, Sunday at the top. Busier days get a denser dither; the busiest day
 * of the year is the one red square.
 *
 * Narrow tiles show only as many of the most recent weeks as fit. The grid is
 * one tab stop: arrow keys walk the days and each one is announced.
 */
export default function GithubActivity({ className }) {
    const [printed, setPrinted] = useState(false)
    // { k: index into DAYS, keys: true when the keyboard put it there }
    const [active, setActive] = useState(null)
    const strip = useRef(null)
    const cells = useRef(null)
    const id = useId()

    // Print the weeks left to right, once, when the grid scrolls into view.
    useEffect(() => {
        const root = strip.current
        const layer = cells.current
        if (!root || !layer) return
        let running = []
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                io.disconnect()
                const still = window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches
                if (!still && typeof layer.animate === "function") {
                    const columns = Array.from(layer.children).slice(
                        firstVisibleColumn(root),
                    )
                    running = columns.map((column, i) => {
                        // Each week is held back, then appears whole. The waits follow an
                        // ease-out curve: the first weeks rattle out, the last ones settle.
                        const p = i / Math.max(1, columns.length - 1)
                        return column.animate(
                            { opacity: [0, 0] },
                            { duration: PRINT_MS * (1 - Math.sqrt(1 - p)) },
                        )
                    })
                }
                setPrinted(true)
            },
            { threshold: 0.5 },
        )
        io.observe(root)
        return () => {
            io.disconnect()
            running.forEach((a) => a.cancel())
        }
    }, [])

    const day = active ? DAYS[active.k] : null
    const text = day
        ? `${contributions(day.n)} · ${weekdayDayMonth(day.date)}`
        : ""

    const point = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const u = rect.width / W
        const c = Math.min(
            COLS - 1,
            Math.max(0, Math.floor((e.clientX - rect.left) / (PITCH * u))),
        )
        const r = Math.min(
            6,
            Math.max(0, Math.floor((e.clientY - rect.top) / (PITCH * u))),
        )
        const k = SLOT.get(c * 7 + r)
        setActive((now) =>
            k === undefined
                ? null
                : now && now.k === k && !now.keys
                  ? now
                  : { k, keys: false },
        )
    }

    const onKeyDown = (e) => {
        if (e.key === "Escape") return setActive(null)
        const first = DAYS.findIndex(
            (d) => d.c >= firstVisibleColumn(e.currentTarget),
        )
        const from = active ? active.k : LAST
        const to = {
            ArrowLeft: from - 7,
            ArrowRight: from + 7,
            ArrowUp: from - 1,
            ArrowDown: from + 1,
            Home: first,
            End: LAST,
        }[e.key]
        if (to === undefined) return
        e.preventDefault()
        // Off the edge of what is shown: stay put (or, with nothing picked yet, start at today).
        setActive({
            k: to >= first && to <= LAST ? to : Math.max(first, from),
            keys: true,
        })
    }

    return (
        <figure className={cn("@container m-0", className)}>
            <div className="rounded-lg bg-tile p-4 [--gut:14px] [--u:2px] sm:p-5 @[860px]:[--u:3px]">
                <div className="flex justify-center">
                    <div
                        aria-hidden="true"
                        className="relative mt-[22px] w-[var(--gut)] shrink-0 font-pixel text-pixel text-faint"
                    >
                        {WEEKDAY_MARKS.map(([letter, r]) => (
                            <span
                                key={letter}
                                className="absolute left-0"
                                style={{
                                    top: `calc(var(--u) * ${r * PITCH + CELL / 2} - 8px)`,
                                }}
                            >
                                {letter}
                            </span>
                        ))}
                    </div>

                    <div
                        ref={strip}
                        role="application"
                        tabIndex={0}
                        aria-label="Contribution calendar"
                        aria-describedby={`${id}-summary`}
                        className="relative min-w-0 rounded-sm"
                        // Whole weeks only: the width is rounded down to a multiple of one week.
                        style={{
                            width: `min(calc(var(--u) * ${W}), round(down, calc(100% - var(--gut)), calc(var(--u) * ${PITCH})))`,
                        }}
                        onFocus={(e) => {
                            if (e.currentTarget.matches(":focus-visible"))
                                setActive(
                                    (now) => now ?? { k: LAST, keys: true },
                                )
                        }}
                        onBlur={() => setActive(null)}
                        onKeyDown={onKeyDown}
                    >
                        {/* Right-aligned and clipped, so a narrow tile keeps the most recent weeks.
                            The extra pixel right and below leaves room for the selection frame. */}
                        <div className="-mb-[var(--u)] -mr-[var(--u)] flex justify-end overflow-hidden pb-[var(--u)] pr-[var(--u)]">
                            <div
                                className="shrink-0"
                                style={{ width: `calc(var(--u) * ${W})` }}
                            >
                                <div
                                    aria-hidden="true"
                                    className="relative mb-1.5 h-4 font-pixel text-pixel text-faint"
                                >
                                    {MONTH_MARKS.map(({ c, m }) => (
                                        <span
                                            key={c}
                                            className="absolute top-0"
                                            style={{
                                                left: `calc(var(--u) * ${c * PITCH})`,
                                            }}
                                        >
                                            {MONTH_INITIALS[m]}
                                        </span>
                                    ))}
                                </div>
                                <div
                                    onPointerDown={point}
                                    onPointerMove={point}
                                    onPointerLeave={(e) => {
                                        if (e.pointerType === "mouse")
                                            setActive(null)
                                    }}
                                >
                                    <svg
                                        viewBox={`0 0 ${W} ${H}`}
                                        shapeRendering="crispEdges"
                                        aria-hidden="true"
                                        className="block max-w-none overflow-visible"
                                        style={{
                                            width: `calc(var(--u) * ${W})`,
                                            height: `calc(var(--u) * ${H})`,
                                        }}
                                    >
                                        <g
                                            ref={cells}
                                            data-print-layer
                                            className={
                                                printed
                                                    ? undefined
                                                    : "opacity-0 motion-reduce:opacity-100"
                                            }
                                        >
                                            {COLUMNS.map((column, c) => (
                                                <g key={c}>
                                                    {column.off ? (
                                                        <path
                                                            d={column.off}
                                                            className="fill-line-2"
                                                        />
                                                    ) : null}
                                                    {column.ink ? (
                                                        <path
                                                            d={column.ink}
                                                            className="fill-ink"
                                                        />
                                                    ) : null}
                                                    {column.red ? (
                                                        <path
                                                            d={column.red}
                                                            className="fill-red"
                                                        />
                                                    ) : null}
                                                </g>
                                            ))}
                                        </g>
                                        {day ? (
                                            <path
                                                fillRule="evenodd"
                                                className="fill-red"
                                                d={
                                                    box(
                                                        day.c * PITCH - 1,
                                                        day.r * PITCH - 1,
                                                        CELL + 2,
                                                    ) +
                                                    box(
                                                        day.c * PITCH,
                                                        day.r * PITCH,
                                                        CELL,
                                                    )
                                                }
                                            />
                                        ) : null}
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {day ? (
                                <motion.div
                                    key="day"
                                    aria-hidden="true"
                                    className="pointer-events-none absolute z-30 whitespace-nowrap rounded-md border border-line bg-paper px-2 py-1 font-pixel text-pixel text-ink shadow-pop"
                                    style={{
                                        // Monospace, so the width is known: centre on the day, but stay inside the grid.
                                        "--w": `calc(${text.length}ch + 18px)`,
                                        width: "var(--w)",
                                        left: `clamp(0px, calc(100% - var(--u) * ${(COLS - 1 - day.c) * PITCH + CELL / 2} - var(--w) / 2), calc(100% - var(--w)))`,
                                        bottom: `calc(var(--u) * ${H - day.r * PITCH} + 6px)`,
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{
                                        opacity: 0,
                                        transition: {
                                            duration: 0.1,
                                            ease: ease.exit,
                                        },
                                    }}
                                    transition={{
                                        duration: 0.16,
                                        ease: ease.drop,
                                    }}
                                >
                                    {contributions(day.n)}
                                    <span className="text-faint">
                                        {" "}
                                        · {weekdayDayMonth(day.date)}
                                    </span>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Without JavaScript nothing prints the grid, so show it. */}
            <noscript>
                <style>{"[data-print-layer]{opacity:1!important}"}</style>
            </noscript>

            <p id={`${id}-summary`} className="sr-only">
                {count(github.total)} contributions on {count(ACTIVE_DAYS)} days
                in the last year.
                {BUSIEST
                    ? ` The busiest day was ${longDate(BUSIEST.date)}, with ${count(BUSIEST.n)}.`
                    : ""}{" "}
                Use the arrow keys to move between days.
            </p>
            <p aria-live="polite" className="sr-only">
                {day && active.keys
                    ? `${contributions(day.n)}, ${longDate(day.date)}`
                    : ""}
            </p>

            <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 font-sans text-ui text-soft">
                <span>
                    <span className="font-pixel text-pixel text-ink">
                        {count(github.total)}
                    </span>{" "}
                    contributions in the last year · synced{" "}
                    <time
                        dateTime={github.syncedAt}
                        className="font-pixel text-pixel"
                    >
                        {dayMonthYear(github.syncedAt)}
                    </time>
                </span>
                <a
                    href={`https://github.com/${github.user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ink-link text-ink"
                >
                    github.com/{github.user}
                </a>
            </figcaption>
        </figure>
    )
}
