"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useId, useRef, useState } from "react"

import { cn } from "@/app/_lib/cn"
import { ease } from "@/app/_lib/motion"
import { sound } from "@/app/_lib/sound"

const EDGE = 12 // the card never gets closer than this to the viewport edge
const OPENED = "now:chip-opened" // one card at a time

/** Where the card goes, measured from the chip at the moment it opens. */
function placeFor(el, width, height) {
    const r = el.getBoundingClientRect()
    const vw = document.documentElement.clientWidth
    const w = Math.min(width, vw - EDGE * 2)
    const centre = r.left + r.width / 2
    const left = Math.min(Math.max(centre - w / 2, EDGE), vw - EDGE - w)
    return {
        below: r.top < height + EDGE + 8, // no room above: flip under the chip
        left: left - r.left,
        width: w,
        origin: centre - left,
    }
}

/**
 * An inline word that opens a small card.
 *
 * Sits inside a paragraph (every element here is a <span>, so it is valid in
 * a <p>). Opens on hover, on keyboard focus and on tap; a click pins it.
 * Closes on Esc, on an outside press, on blur, or when another chip opens.
 *
 * Props:
 *   glyph        tiny leading drawing (decorative)
 *   children     the word(s) shown in the sentence
 *   popover      card contents; use phrasing elements only (span, a, svg, time)
 *   summary      plain-text version of the card for screen readers (read-only cards)
 *   interactive  true when the card holds a link: it then behaves as a small
 *                dialog (aria-expanded) instead of a description
 *   title        accessible name of the card when `interactive`
 *   width/height the card's width and rough height, used to place it
 */
export default function Chip({
    glyph,
    children,
    popover,
    summary,
    title,
    interactive = false,
    width = 248,
    height = 150,
    className,
}) {
    // null (closed) | "hover" | "focus" | "pinned"
    const [mode, setMode] = useState(null)
    const [place, setPlace] = useState(null)
    const wrap = useRef(null)
    const leaveTimer = useRef(null)
    const id = useId()
    const open = mode !== null && place !== null

    useEffect(() => {
        if (!open) return
        const close = () => setMode(null)
        const onDown = (e) => {
            if (!wrap.current?.contains(e.target)) close()
        }
        const onKey = (e) => {
            if (e.key === "Escape") close()
        }
        const onOther = (e) => {
            if (e.detail !== id) close()
        }
        document.addEventListener("pointerdown", onDown)
        document.addEventListener("keydown", onKey)
        document.addEventListener(OPENED, onOther)
        window.addEventListener("resize", close)
        return () => {
            document.removeEventListener("pointerdown", onDown)
            document.removeEventListener("keydown", onKey)
            document.removeEventListener(OPENED, onOther)
            window.removeEventListener("resize", close)
        }
    }, [open, id])

    useEffect(() => () => clearTimeout(leaveTimer.current), [])

    const show = (next) => {
        clearTimeout(leaveTimer.current)
        if (mode === null && wrap.current) {
            setPlace(placeFor(wrap.current, width, height))
            document.dispatchEvent(new CustomEvent(OPENED, { detail: id }))
            sound.ui("tick", { volume: 0.5 })
        }
        setMode(next)
    }

    const hide = () => {
        clearTimeout(leaveTimer.current)
        setMode(null)
    }

    const describedBy = interactive
        ? undefined
        : summary
          ? `${id}-summary`
          : open
            ? id
            : undefined

    return (
        <span
            ref={wrap}
            className={cn("relative inline-block", open && "z-30", className)}
            onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return
                clearTimeout(leaveTimer.current)
                if (mode === null) show("hover")
            }}
            onPointerLeave={(e) => {
                if (e.pointerType !== "mouse" || mode !== "hover") return
                leaveTimer.current = setTimeout(
                    () => setMode((m) => (m === "hover" ? null : m)),
                    120,
                )
            }}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget))
                    setMode((m) => (m === "hover" ? m : null))
            }}
        >
            <button
                type="button"
                aria-describedby={describedBy}
                aria-haspopup={interactive ? "dialog" : undefined}
                aria-expanded={interactive ? open : undefined}
                aria-controls={interactive && open ? id : undefined}
                onFocus={(e) => {
                    if (mode === null && e.target.matches(":focus-visible"))
                        show("focus")
                }}
                onClick={() =>
                    mode === "pinned" || mode === "focus"
                        ? hide()
                        : show("pinned")
                }
                className={cn(
                    "cursor-pointer rounded-sm border px-[0.34em] leading-[1.3] text-ink",
                    "transition-colors duration-[var(--duration-quick)] ease-[var(--ease-standard)]",
                    open
                        ? "border-line-2 bg-tile-2"
                        : "border-line bg-tile hover:border-line-2 hover:bg-tile-2",
                )}
            >
                {glyph ? (
                    <span
                        aria-hidden="true"
                        className="mr-[0.34em] inline-block"
                    >
                        {glyph}
                    </span>
                ) : null}
                <span className="inline-block max-w-[min(15em,58vw)] truncate align-bottom">
                    {children}
                </span>
            </button>

            {summary && !interactive ? (
                <span id={`${id}-summary`} className="sr-only">
                    {summary}
                </span>
            ) : null}

            <AnimatePresence>
                {open ? (
                    <motion.span
                        key="card"
                        id={id}
                        role={
                            interactive
                                ? "dialog"
                                : summary
                                  ? undefined
                                  : "tooltip"
                        }
                        aria-label={interactive ? title : undefined}
                        aria-hidden={!interactive && summary ? true : undefined}
                        className={cn(
                            "absolute z-30 block cursor-default text-left font-sans text-ui font-normal not-italic text-ink",
                            place.below ? "top-full pt-2" : "bottom-full pb-2",
                        )}
                        style={{
                            left: place.left,
                            width: place.width,
                            transformOrigin: `${place.origin}px ${place.below ? "0%" : "100%"}`,
                        }}
                        initial={{
                            opacity: 0,
                            scale: 0.96,
                            y: place.below ? -4 : 4,
                        }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{
                            opacity: 0,
                            scale: 0.98,
                            transition: { duration: 0.1, ease: ease.exit },
                        }}
                        transition={{ duration: 0.18, ease: ease.drop }}
                    >
                        <span className="block rounded-md border border-line bg-paper p-3 shadow-pop">
                            {popover}
                        </span>
                    </motion.span>
                ) : null}
            </AnimatePresence>
        </span>
    )
}
