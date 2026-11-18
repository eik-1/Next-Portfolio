"use client"

import Link from "next/link"

import { cn } from "@/app/_lib/cn"

import { Bands, Ribbon } from "./Bookshelf"
import { FOOT, GAP, HEAD, SHELF, TONES, u } from "./shelf"

const FEW = 7 // spines shown in a narrow tile; a wide one shows the whole shelf

const stroke = "block w-px bg-current"

/** Type too small to set: the title and the author as plain strokes, as long as the words are. */
function Greek({ book }) {
    const title =
        Math.min(
            book.title.length * 5.2,
            (book.height - HEAD - FOOT) * 0.5 * book.lines,
        ) / book.lines
    return (
        <span
            className="absolute inset-0 flex flex-col items-center opacity-30"
            style={{ paddingTop: u(HEAD + 6), paddingBottom: u(FOOT) }}
        >
            <span className="flex flex-row-reverse" style={{ columnGap: u(5) }}>
                {Array.from({ length: book.lines }, (_, i) => (
                    <span
                        key={i}
                        className={stroke}
                        style={{
                            height: u(
                                Math.round(
                                    i === book.lines - 1 && i > 0
                                        ? title * 0.7
                                        : title,
                                ),
                            ),
                        }}
                    />
                ))}
            </span>
            <span
                className={`${stroke} mt-auto`}
                style={{ height: u(book.surname.length * 2.6) }}
            />
        </span>
    )
}

/**
 * The shelf in miniature, for the About page: a few spines on a line inside a
 * tile, the ones I'm reading first. The whole thing is one link to /library.
 * Works from about 320px wide up to the full 1040px column.
 */
export default function ShelfPreview({ className }) {
    const count = SHELF.length
    return (
        <Link href="/library" className={cn("group/shelf block", className)}>
            <span className="@container block overflow-hidden rounded-lg bg-tile">
                <span
                    aria-hidden
                    className="block px-5 pb-6 pt-9 [--s:clamp(0.62px,calc(100cqw/760),1px)] @md:px-8 @md:pb-8 @md:pt-11"
                >
                    <span
                        className="flex items-end justify-center"
                        style={{ columnGap: u(GAP) }}
                    >
                        {SHELF.map((book, i) => (
                            <span
                                key={book.id}
                                className={cn(
                                    "group/spine relative shrink-0",
                                    i >= FEW && "hidden @md:block",
                                )}
                                style={{
                                    width: u(book.width),
                                    height: u(book.height),
                                }}
                            >
                                <span
                                    className={cn(
                                        "absolute inset-0 block transition-transform duration-[var(--duration-base)] ease-out group-hover/spine:-translate-y-1.5 motion-reduce:transition-none",
                                        TONES[book.spine].type,
                                    )}
                                >
                                    {book.status === "reading" && <Ribbon />}
                                    <span
                                        className={cn(
                                            "absolute inset-0 block rounded-[2px]",
                                            TONES[book.spine].cloth,
                                        )}
                                    />
                                    <Bands band={book.band} />
                                    <Greek book={book} />
                                </span>
                            </span>
                        ))}
                    </span>
                    <span className="block h-px bg-line-2" />
                </span>
            </span>
            <span className="label mt-3 block transition-colors duration-[var(--duration-quick)] group-hover/shelf:text-ink">
                {count} {count === 1 ? "book" : "books"} on the shelf
            </span>
        </Link>
    )
}
