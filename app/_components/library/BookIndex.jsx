"use client"

import { OPEN_EVENT, READING, SHELF } from "./shelf"

/**
 * The shelf as a plain list: every book, in shelf order. Each row is a real
 * link to the book's deep link (#id); on a plain click it asks the shelf to
 * open the book in place instead of adding a history entry.
 */
export default function BookIndex() {
    const ask = (e, id) => {
        if (
            e.defaultPrevented ||
            e.button !== 0 ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey
        )
            return
        e.preventDefault()
        window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }))
    }
    return (
        <section aria-labelledby="book-index">
            <div className="flex items-baseline justify-between gap-4">
                <h2 id="book-index" className="label">
                    The same shelf, as a list
                </h2>
                {READING > 0 && (
                    <p className="label flex items-center gap-2">
                        <span
                            aria-hidden
                            className="h-1.5 w-1.5 rounded-full bg-red"
                        />
                        reading now
                    </p>
                )}
            </div>
            <ul className="mt-3 divide-y divide-line">
                {SHELF.map((book) => (
                    <li key={book.id}>
                        <a
                            href={`#${book.id}`}
                            onClick={(e) => ask(e, book.id)}
                            className="group flex items-baseline gap-4 py-3"
                        >
                            <span className="min-w-0 flex-1">
                                <cite className="italic text-ink underline decoration-transparent decoration-1 underline-offset-[0.2em] transition-colors duration-[var(--duration-quick)] group-hover:decoration-line-2">
                                    {book.title}
                                </cite>
                                {book.status === "reading" && (
                                    <>
                                        <span
                                            aria-hidden
                                            className="ml-2 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-red"
                                        />
                                        <span className="sr-only">
                                            , reading now
                                        </span>
                                    </>
                                )}
                                <span className="ml-3 text-small text-soft">
                                    {book.author}
                                </span>
                            </span>
                            <span className="shrink-0 font-pixel text-pixel text-faint">
                                {book.year}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    )
}
