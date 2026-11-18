"use client"

import { AnimatePresence } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/app/_lib/cn"
import { sound } from "@/app/_lib/sound"
import { useReducedMotion } from "@/app/_lib/useReducedMotion"

import BookDetail from "./BookDetail"
import {
    FOOT,
    GAP,
    HALF_UNITS,
    HEAD,
    LINE_HEIGHT,
    NAME_SIZE,
    OPEN_EVENT,
    READING,
    ROW_UNITS,
    SHELF,
    TALLEST,
    THEMES,
    TONES,
    u,
} from "./shelf"

const REACH = 84 // px: how far the cursor's wave carries along the shelf
const LIFT = 7 // px: how high the nearest book rises

const bandRule = "absolute inset-x-[3px] block h-px bg-current opacity-25"

/** The cloth details shared by the shelf and the home-page preview: bands at the head of the spine. */
export function Bands({ band }) {
    if (!band) return null
    return (
        <>
            <span aria-hidden className={bandRule} style={{ top: u(6) }} />
            {band === 2 && (
                <span aria-hidden className={bandRule} style={{ top: u(9) }} />
            )}
        </>
    )
}

/** A bookmark ribbon, standing a little proud of the pages. */
export function Ribbon() {
    return (
        <span
            aria-hidden
            className="absolute bottom-full right-[24%] block rounded-t-[1px] bg-red"
            style={{ width: u(5), height: u(8) }}
        />
    )
}

function Spine({ book, tabbable, dimmed, away, onOpen, onFocus, register }) {
    const tone = TONES[book.spine]
    const reading = book.status === "reading"
    return (
        <div
            className="relative shrink-0"
            style={{ width: u(book.width), height: u(book.height) }}
        >
            {/* each book draws the shelf under its own row; the row clips it to the column */}
            <span
                aria-hidden
                className="pointer-events-none absolute -inset-x-[100vw] top-full block h-px bg-[color-mix(in_srgb,var(--ink)_22%,var(--paper))]"
            />
            <button
                type="button"
                ref={register}
                tabIndex={tabbable ? 0 : -1}
                onClick={onOpen}
                onFocus={onFocus}
                aria-label={`${book.title} by ${book.author}${reading ? ", reading now" : ""}. Open.`}
                className={cn(
                    "group absolute inset-0 block transition-opacity duration-[var(--duration-base)]",
                    dimmed && "opacity-25",
                )}
            >
                {/* the wave moves this wrapper; the button underneath keeps its place so the hover never flickers */}
                <span
                    data-lift
                    className={cn(
                        "absolute inset-0 block transition-transform duration-[var(--duration-base)] ease-out group-focus-visible:-translate-y-1.5",
                        away && "opacity-0",
                    )}
                >
                    {reading && <Ribbon />}
                    <span
                        data-cloth
                        className={cn(
                            "absolute inset-0 block rounded-[2px]",
                            tone.cloth,
                        )}
                    />
                    <span
                        className={cn(
                            "absolute inset-0 flex flex-col items-center",
                            tone.type,
                        )}
                        style={{ paddingTop: u(HEAD), paddingBottom: u(FOOT) }}
                    >
                        <Bands band={book.band} />
                        <span className="flex min-h-0 w-full flex-1 items-center justify-center">
                            <span
                                className="max-h-full text-center font-serif tracking-tight text-balance [writing-mode:vertical-rl]"
                                style={{
                                    fontSize: u(book.size),
                                    lineHeight: LINE_HEIGHT,
                                }}
                            >
                                {book.title}
                            </span>
                        </span>
                        <span
                            className="shrink-0 whitespace-nowrap font-sans leading-none opacity-60 [writing-mode:vertical-rl]"
                            style={{
                                fontSize: u(NAME_SIZE),
                                paddingTop: u(10),
                            }}
                        >
                            {book.surname}
                        </span>
                    </span>
                </span>
            </button>
        </div>
    )
}

const clearHash = () => {
    if (window.location.hash)
        window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
        )
}

/**
 * The shelf. Books rise a little under the cursor, like running a finger along
 * the spines; open one and its cloth flies out to become the cover.
 * Roving tabindex: ← → Home End. Deep links: /library#meditations.
 */
export default function Bookshelf() {
    const reduced = useReducedMotion()
    const [theme, setTheme] = useState(null)
    const [openId, setOpenId] = useState(null)
    const [away, setAway] = useState(null) // the book that is off the shelf, until its cover lands again
    const [cursor, setCursor] = useState(SHELF[0].id)
    const spines = useRef(new Map())
    const current = useRef(null)
    const returnTo = useRef(null)

    const index = SHELF.findIndex((b) => b.id === openId)
    const open = SHELF[index] ?? null
    const isOpen = Boolean(open)
    const matches = theme
        ? SHELF.filter((b) => b.theme === theme).length
        : SHELF.length

    const show = useCallback((id) => {
        current.current = id
        setOpenId(id)
        setAway(id)
        setCursor(id)
        if (window.location.hash !== `#${id}`)
            window.history.replaceState(null, "", `#${id}`)
    }, [])

    const openBook = useCallback(
        (id) => {
            const at = document.activeElement
            if (!at?.closest?.('[role="dialog"]'))
                returnTo.current = at && at !== document.body ? at : null
            sound.ui("open")
            show(id)
        },
        [show],
    )
    const close = useCallback(() => {
        sound.ui("close")
        setOpenId(null)
        clearHash()
        // Back to whatever opened the book; if that was the shelf, to the book just put back.
        const from = returnTo.current
        const spine = spines.current.get(current.current)
        const back =
            from?.isConnected && ![...spines.current.values()].includes(from)
                ? from
                : spine
        requestAnimationFrame(() => back?.focus({ preventScroll: true }))
    }, [])
    const step = useCallback(
        (dir) => {
            const i = SHELF.findIndex((b) => b.id === current.current)
            const next = SHELF[(i + dir + SHELF.length) % SHELF.length]
            sound.ui("tick")
            show(next.id)
        },
        [show],
    )
    const slotOf = useCallback(
        (id) =>
            spines.current
                .get(id)
                ?.querySelector("[data-cloth]")
                ?.getBoundingClientRect() ?? null,
        [],
    )

    // Deep links (/library#meditations), the browser's back button, and the index below the shelf.
    useEffect(() => {
        const fromHash = () => {
            let id = ""
            try {
                id = decodeURIComponent(window.location.hash.slice(1))
            } catch {}
            if (SHELF.some((b) => b.id === id)) openBook(id)
            else if (!id) setOpenId(null)
        }
        const onAsk = (e) => {
            if (SHELF.some((b) => b.id === e.detail)) openBook(e.detail)
        }
        const raf = requestAnimationFrame(fromHash)
        window.addEventListener("hashchange", fromHash)
        window.addEventListener(OPEN_EVENT, onAsk)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("hashchange", fromHash)
            window.removeEventListener(OPEN_EVENT, onAsk)
        }
    }, [openBook])

    // Hold the page still while a book is open, without the scrollbar's width making it jump.
    useEffect(() => {
        if (!isOpen) return undefined
        const html = document.documentElement
        const bar = window.innerWidth - html.clientWidth
        html.style.overflow = "hidden"
        if (bar > 0) html.style.paddingRight = `${bar}px`
        return () => {
            html.style.overflow = ""
            html.style.paddingRight = ""
        }
    }, [isOpen])

    const wave = (e) => {
        if (reduced || e.pointerType !== "mouse") return
        const rowHeight = TALLEST + 30
        spines.current.forEach((el) => {
            const r = el.getBoundingClientRect()
            const sameRow =
                e.clientY < r.bottom + 20 && e.clientY > r.bottom - rowHeight
            const dx = r.left + r.width / 2 - e.clientX
            const k = sameRow ? Math.max(0, 1 - Math.abs(dx) / REACH) ** 2 : 0
            const lift = el.querySelector("[data-lift]")
            if (lift)
                lift.style.transform =
                    k > 0.01
                        ? `translate3d(0, ${(-LIFT * k).toFixed(1)}px, 0)`
                        : ""
        })
    }
    const calm = () =>
        spines.current.forEach((el) =>
            el.querySelector("[data-lift]")?.style.removeProperty("transform"),
        )

    const onKey = (e) => {
        const i = SHELF.findIndex((b) => b.id === cursor)
        const to = {
            ArrowRight: i + 1,
            ArrowLeft: i - 1,
            Home: 0,
            End: SHELF.length - 1,
        }[e.key]
        if (to === undefined) return
        e.preventDefault()
        const next = SHELF[Math.max(0, Math.min(SHELF.length - 1, to))]
        if (next.id !== cursor) sound.ui("tick")
        setCursor(next.id)
        spines.current.get(next.id)?.focus()
    }

    const chip = (on) =>
        cn(
            "-my-1 py-1 transition-colors duration-[var(--duration-quick)]",
            on ? "text-ink" : "text-soft hover:text-ink",
        )

    return (
        <section aria-label="Bookshelf">
            <div
                className="flex flex-wrap gap-x-4 gap-y-1.5 font-sans text-ui"
                role="group"
                aria-label="Highlight a theme"
            >
                <button
                    type="button"
                    className={chip(!theme)}
                    aria-pressed={!theme}
                    onClick={() => setTheme(null)}
                >
                    All
                </button>
                {THEMES.map((name) => (
                    <button
                        key={name}
                        type="button"
                        className={chip(theme === name)}
                        aria-pressed={theme === name}
                        onClick={() => setTheme(theme === name ? null : name)}
                    >
                        {name}
                    </button>
                ))}
            </div>

            <div className="@container mt-12">
                <div
                    onPointerMove={wave}
                    onPointerLeave={calm}
                    onKeyDown={onKey}
                    role="toolbar"
                    aria-label="Books. Use the arrow keys to move along the shelf."
                    aria-orientation="horizontal"
                    className="flex flex-wrap items-end gap-y-10 overflow-x-clip pb-px [--s:min(1px,calc(100cqw/var(--half)))] @[500px]:[--s:min(1px,calc(100cqw/var(--row)))]"
                    style={{
                        "--row": ROW_UNITS,
                        "--half": HALF_UNITS,
                        columnGap: u(GAP),
                    }}
                >
                    {SHELF.map((b) => (
                        <Spine
                            key={b.id}
                            book={b}
                            tabbable={b.id === cursor}
                            dimmed={Boolean(theme) && b.theme !== theme}
                            away={away === b.id}
                            onOpen={() => openBook(b.id)}
                            onFocus={() => setCursor(b.id)}
                            register={(el) => {
                                if (el) spines.current.set(b.id, el)
                                else spines.current.delete(b.id)
                            }}
                        />
                    ))}
                </div>
            </div>

            <p
                className="mt-4 flex items-center gap-2 font-pixel text-pixel text-faint"
                aria-live="polite"
            >
                {theme ? (
                    <span>
                        {matches} of {SHELF.length} · {theme}
                    </span>
                ) : (
                    <>
                        <span>{SHELF.length} books</span>
                        {READING > 0 && (
                            <>
                                <span aria-hidden>·</span>
                                <span
                                    aria-hidden
                                    className="h-2 w-1 rounded-t-[1px] bg-red"
                                />
                                <span>{READING} with a bookmark in</span>
                            </>
                        )}
                    </>
                )}
            </p>

            <AnimatePresence onExitComplete={() => setAway(null)}>
                {open && (
                    <BookDetail
                        key="detail"
                        book={open}
                        index={index}
                        total={SHELF.length}
                        reduced={reduced}
                        slotOf={slotOf}
                        onClose={close}
                        onStep={step}
                    />
                )}
            </AnimatePresence>
        </section>
    )
}
