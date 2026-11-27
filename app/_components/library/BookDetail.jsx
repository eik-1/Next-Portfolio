"use client"

import { motion, useIsPresent } from "motion/react"
import { useEffect, useEffectEvent, useLayoutEffect, useRef } from "react"

import { cn } from "@/app/_lib/cn"
import { duration, ease } from "@/app/_lib/motion"

import BookCover from "./BookCover"
import { TONES } from "./shelf"

/* Only the cloth travels. Everything printed on it, and the words beside it,
   fade in once it has nearly landed and fade out before it leaves. */
const fade = (show, exit) => ({
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: show },
    exit: { opacity: 0, transition: exit },
})
const MOVING = {
    scrim: fade(
        { duration: duration.base, ease: ease.standard },
        { duration: duration.slow, ease: ease.standard },
    ),
    print: fade(
        { duration: duration.base, delay: 0.2 },
        { duration: duration.press },
    ),
    panel: fade(
        { duration: duration.base, delay: 0.14 },
        { duration: duration.quick },
    ),
}
const quick = fade({ duration: duration.quick }, { duration: duration.quick })
const STILL = { scrim: quick, print: quick, panel: quick }

const textButton =
    "-my-2 py-2 font-sans text-ui text-soft transition-colors duration-[var(--duration-quick)] hover:text-ink disabled:pointer-events-none disabled:text-faint"

/**
 * The book's real cover, printed onto the cloth once it lands. A hairline
 * crease near the spine edge makes it read as a bound book, not a picture.
 */
function RealCover({ book, titleId }) {
    return (
        <div className="absolute inset-0 overflow-hidden rounded-sm">
            <h2 id={titleId} className="sr-only">
                {book.title}
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
            <img
                src={book.cover.src}
                width={book.cover.w}
                height={book.cover.h}
                alt=""
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <span
                aria-hidden
                className="absolute inset-y-0 left-[5%] w-px bg-black/25"
            />
            <span
                aria-hidden
                className="absolute inset-y-0 left-[calc(5%+1px)] w-px bg-white/20"
            />
        </div>
    )
}

const onScreen = (r) =>
    r &&
    r.width > 0 &&
    r.bottom > 0 &&
    r.right > 0 &&
    r.top < window.innerHeight &&
    r.left < window.innerWidth

/**
 * The open book. Its cloth flies out of the spine's slot on the shelf to
 * become the cover, and goes back to the slot of whichever book is open when
 * you close. A modal: focus stays inside, Esc closes, ← → walk the shelf.
 */
export default function BookDetail({
    book,
    index,
    total,
    reduced,
    slotOf,
    onClose,
    onStep,
}) {
    const root = useRef(null)
    const cloth = useRef(null)
    const present = useIsPresent()
    const tone = TONES[book.spine]
    const v = reduced ? STILL : MOVING
    const titleId = `book-title-${book.id}`
    const reading = book.status === "reading"

    const fly = useEffectEvent((entering) => {
        const el = cloth.current
        if (!el?.animate) return undefined
        const slot = reduced ? null : slotOf(book.id)
        const box = el.getBoundingClientRect()
        const travel = onScreen(slot) && box.width > 0
        const away = travel
            ? {
                  transform: `translate(${slot.left - box.left}px, ${slot.top - box.top}px) scale(${slot.width / box.width}, ${slot.height / box.height})`,
              }
            : { opacity: 0 }
        const home = travel ? { transform: "none" } : { opacity: 1 }
        const flight = el.animate(entering ? [away, home] : [home, away], {
            duration: (travel ? duration.slow : duration.quick) * 1000,
            easing: `cubic-bezier(${ease.standard.join(",")})`,
            fill: entering ? "backwards" : "forwards",
        })
        return () => flight.cancel()
    })
    useLayoutEffect(() => fly(present), [present])

    useEffect(() => {
        root.current
            ?.querySelector('[data-control="close"]')
            ?.focus({ preventScroll: true })
    }, [])

    useEffect(() => {
        if (!present) return undefined
        const onKey = (e) => {
            if (e.key === "Escape") {
                e.preventDefault()
                onClose()
            } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault()
                onStep(e.key === "ArrowRight" ? 1 : -1)
            } else if (e.key === "Tab") {
                const stops = root.current?.querySelectorAll(
                    "button:not([disabled])",
                )
                if (!stops?.length) return
                const first = stops[0]
                const last = stops[stops.length - 1]
                const at = document.activeElement
                if (
                    !root.current.contains(at) ||
                    (!e.shiftKey && at === last)
                ) {
                    e.preventDefault()
                    first.focus()
                } else if (e.shiftKey && at === first) {
                    e.preventDefault()
                    last.focus()
                }
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [present, onClose, onStep])

    return (
        <motion.div
            ref={root}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            inert={!present}
            initial="hidden"
            animate="show"
            exit="exit"
            className={cn(
                "fixed inset-0 z-50 overflow-y-auto overscroll-contain",
                !present && "pointer-events-none",
            )}
        >
            <motion.div
                aria-hidden
                variants={v.scrim}
                className="fixed inset-0 bg-paper"
                onClick={onClose}
            />

            <motion.button
                type="button"
                data-control="close"
                variants={v.panel}
                onClick={onClose}
                className={cn(
                    textButton,
                    "fixed right-5 top-6 z-10 my-0 px-1 py-1",
                )}
            >
                Close
            </motion.button>

            <div className="pointer-events-none relative mx-auto flex min-h-full w-full max-w-[820px] items-center px-5 py-20">
                <div className="grid w-full gap-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-12 md:gap-16">
                    <div
                        className="pointer-events-auto relative w-36 sm:w-48 md:w-56"
                        style={{
                            aspectRatio: book.cover
                                ? `${book.cover.w} / ${book.cover.h}`
                                : "2 / 3",
                        }}
                    >
                        <motion.div
                            aria-hidden
                            variants={v.print}
                            className="absolute inset-0 rounded-sm shadow-pop"
                        />
                        <div
                            ref={cloth}
                            aria-hidden
                            className={cn(
                                "absolute inset-0 origin-top-left rounded-sm",
                                tone.cloth,
                            )}
                        />
                        <motion.div
                            variants={v.print}
                            className="absolute inset-0"
                        >
                            {book.cover ? (
                                <RealCover book={book} titleId={titleId} />
                            ) : (
                                <BookCover book={book} titleId={titleId} />
                            )}
                        </motion.div>
                    </div>

                    <motion.div
                        variants={v.panel}
                        aria-live="polite"
                        className="pointer-events-auto min-w-0 max-w-[30rem]"
                    >
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: duration.quick }}
                        >
                            <p className="label flex items-center gap-2">
                                <span>{book.theme}</span>
                                <span aria-hidden className="text-faint">
                                    ·
                                </span>
                                {reading && (
                                    <span
                                        aria-hidden
                                        className="h-1.5 w-1.5 rounded-full bg-red"
                                    />
                                )}
                                <span>{reading ? "Reading now" : "Read"}</span>
                            </p>
                            {book.quote ? (
                                <figure className="mt-4">
                                    <blockquote className="font-serif text-intro italic text-ink text-pretty">
                                        “{book.quote}”
                                    </blockquote>
                                    <figcaption className="mt-5 text-small text-soft">
                                        {book.author},{" "}
                                        <cite className="italic">
                                            {book.title}
                                        </cite>
                                        , {book.year}
                                    </figcaption>
                                </figure>
                            ) : (
                                <div className="mt-4">
                                    <p className="font-serif text-intro text-ink">
                                        Still reading this one.
                                    </p>
                                    <p className="mt-2 text-soft text-pretty">
                                        I keep a line when I finish a book, so
                                        there isn&apos;t one here yet.
                                    </p>
                                    <p className="mt-5 text-small text-soft">
                                        {book.author},{" "}
                                        <cite className="italic">
                                            {book.title}
                                        </cite>
                                        , {book.year}
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        <div className="mt-8 flex items-center gap-5 border-t border-line pt-4">
                            <button
                                type="button"
                                className={textButton}
                                disabled={total < 2}
                                onClick={() => onStep(-1)}
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                className={textButton}
                                disabled={total < 2}
                                onClick={() => onStep(1)}
                            >
                                Next
                            </button>
                            <span className="ml-auto font-pixel text-pixel text-faint">
                                {index + 1} of {total}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
