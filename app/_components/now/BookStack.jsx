"use client"

import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useId, useState } from "react"

import { cn } from "@/app/_lib/cn"
import { duration, ease, spring } from "@/app/_lib/motion"
import { sound } from "@/app/_lib/sound"

import { reading, toneOf } from "./reading"
import Tile from "./Tile"

const DEPTH = 16 // how far each book recedes (drawn at 45°)

// Top of the pile first. Sizes and resting offsets are a little uneven on purpose.
const SHAPES = [
    { width: 168, height: 26, x: 8 },
    { width: 202, height: 30, x: -8 },
    { width: 184, height: 34, x: 2 },
]

/**
 * One hardback lying flat, drawn in oblique projection: the spine faces you
 * (so its title stays crisp), the cover recedes above it, and the tail shows
 * the page block between two boards.
 */
function Book({
    book,
    shape,
    index,
    total,
    lifted,
    pulled,
    expanded,
    controls,
    onPress,
}) {
    const tone = toneOf(book)
    const { width, height } = shape

    return (
        <motion.button
            type="button"
            aria-expanded={expanded}
            aria-controls={expanded ? controls : undefined}
            onClick={onPress}
            className="relative block shrink-0 text-left"
            style={{
                width: width + DEPTH,
                height: height + DEPTH,
                marginTop: index ? -DEPTH : 0,
                zIndex: total - index,
            }}
            initial={false}
            animate={{ x: shape.x + (pulled ? 14 : 0), y: lifted ? -8 : 0 }}
            transition={spring.press}
        >
            {/* cover, receding */}
            <span
                aria-hidden="true"
                className={cn(
                    "absolute left-0 top-0 origin-bottom-left -skew-x-[45deg] border",
                    tone.face,
                )}
                style={{ width, height: DEPTH }}
            />

            {/* tail: pages between the boards */}
            <span
                aria-hidden="true"
                className="absolute origin-top-left -skew-y-[45deg] overflow-hidden border border-line-2 bg-paper"
                style={{ left: width, top: DEPTH, width: DEPTH, height }}
            >
                <span
                    className={cn(
                        "absolute inset-x-0 top-0 h-[2px]",
                        tone.board,
                    )}
                />
                <span
                    className={cn(
                        "absolute inset-x-0 bottom-0 h-[2px]",
                        tone.board,
                    )}
                />
                <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
            </span>

            {/* ribbon, only on the book being read first */}
            {index === 0 ? (
                <span
                    aria-hidden="true"
                    className="absolute w-[5px] bg-red [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]"
                    style={{
                        left: width + 6,
                        top: DEPTH + height / 2 - 6,
                        height: height / 2 + 20,
                    }}
                />
            ) : null}

            {/* spine */}
            <span
                className={cn(
                    "absolute left-0 flex items-center border px-[22px]",
                    tone.face,
                )}
                style={{ top: DEPTH, width, height }}
            >
                <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-[10px] w-px bg-current opacity-25"
                />
                <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-[13px] w-px bg-current opacity-25"
                />
                <span
                    aria-hidden="true"
                    className="absolute inset-y-0 right-[10px] w-px bg-current opacity-25"
                />
                <span className="block truncate font-serif text-[14px] leading-none">
                    {book.title}
                </span>
            </span>
        </motion.button>
    )
}

/**
 * What's on the nightstand: the books marked "reading", stacked. Hovering the
 * pile lifts the top one; pressing a book slides it out and shows who wrote it.
 */
export default function BookStack() {
    const pile = reading.slice(0, SHAPES.length)
    const [openId, setOpenId] = useState(null)
    const [hovered, setHovered] = useState(false)
    const cardId = useId()
    const open = pile.find((b) => b.id === openId) ?? null

    const press = (id) => {
        sound.ui(openId === id ? "close" : "open")
        setOpenId((current) => (current === id ? null : id))
    }

    return (
        <Tile caption="Reading">
            <div
                className="flex h-full items-center justify-center"
                onKeyDown={(e) => {
                    if (e.key === "Escape") setOpenId(null)
                }}
            >
                <div className="shrink-0 scale-[0.8] @[272px]:scale-100">
                    <motion.div
                        className="flex flex-col items-center"
                        initial={false}
                        animate={{ y: open ? -24 : 0 }}
                        transition={spring.platter}
                        onPointerEnter={(e) => {
                            if (e.pointerType === "mouse") setHovered(true)
                        }}
                        onPointerLeave={() => setHovered(false)}
                    >
                        {pile.map((book, i) => (
                            <Book
                                key={book.id}
                                book={book}
                                shape={SHAPES[i]}
                                index={i}
                                total={pile.length}
                                lifted={
                                    i === 0 && (hovered || openId === book.id)
                                }
                                pulled={openId === book.id}
                                expanded={openId === book.id}
                                controls={cardId}
                                onPress={() => press(book.id)}
                            />
                        ))}
                    </motion.div>
                </div>

                <AnimatePresence>
                    {open ? (
                        <motion.div
                            key={open.id}
                            id={cardId}
                            className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 rounded-md border border-line bg-paper px-3 py-2.5"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{
                                opacity: 0,
                                transition: { duration: 0.1, ease: ease.exit },
                            }}
                            transition={{
                                duration: duration.base,
                                ease: ease.drop,
                            }}
                        >
                            <p className="min-w-0">
                                <span className="block truncate font-serif text-small italic leading-[1.35] text-ink">
                                    {open.title}
                                </span>
                                <span className="block truncate font-sans text-ui text-soft">
                                    {open.author}
                                </span>
                            </p>
                            <Link
                                href="/library"
                                className="ink-link shrink-0 font-sans text-ui text-ink"
                            >
                                Library →
                            </Link>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </Tile>
    )
}
