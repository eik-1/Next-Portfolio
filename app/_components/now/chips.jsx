"use client"

import { useEffect, useState } from "react"

import covers from "@/app/_data/covers.json"
import { appleMusic, records } from "@/app/_data/library"
import { site } from "@/app/_data/site"
import { cn } from "@/app/_lib/cn"
import { player, sameTrack, usePlayer } from "@/app/_lib/player"
import { useSound } from "@/app/_lib/sound"

import Chip from "./Chip"
import { phaseOf, useClock } from "./clock"
import Disc from "./Disc"
import Equalizer from "./Equalizer"
import { IndiaMap, Moon, Sun } from "./pixels"
import { reading } from "./reading"

// Short name of `site.timezone`. Intl only gives "GMT+5:30" for it in most locales.
const ZONE = "IST"

/**
 * "…a software engineer in [India]."
 * The card: a dot-matrix map, the local time, and what that hour means here.
 */
export function PlaceChip({ className }) {
    const clock = useClock()
    const phase = clock ? phaseOf(clock.hour) : null
    const Body = phase?.body === "moon" ? Moon : Sun

    return (
        <Chip
            className={className}
            glyph={<Body className="translate-y-px text-soft" />}
            summary={
                clock
                    ? `${clock.hh}:${clock.mm} ${ZONE} right now. ${phase.line}`
                    : undefined
            }
            width={272}
            height={124}
            popover={
                <span className="flex items-center gap-4">
                    <IndiaMap className="shrink-0 text-soft" />
                    <span className="block min-w-0">
                        <span className="flex items-baseline gap-2">
                            <time
                                dateTime={clock?.iso}
                                className="font-pixel text-[22px] leading-none text-ink"
                            >
                                {clock ? clock.hh : "--"}
                                <span className="animate-blink">:</span>
                                {clock ? clock.mm : "--"}
                            </time>
                            <span className="font-pixel text-pixel text-faint">
                                {ZONE}
                            </span>
                        </span>
                        <span className="mt-1 block font-pixel text-pixel text-faint">
                            {clock?.date ?? " "}
                        </span>
                        {phase ? (
                            <span className="mt-2 flex items-start gap-2 text-soft">
                                <Body className="mt-[5px] shrink-0 text-ink" />
                                <span>{phase.line}</span>
                            </span>
                        ) : null}
                    </span>
                </span>
            }
        >
            {site.location}
        </Chip>
    )
}

/** A closed book the size of a lowercase letter, ribbon hanging under the baseline. */
function BookGlyph() {
    return (
        <span className="relative inline-block h-[11px] w-[9px] rounded-[1px] bg-ink">
            <span className="absolute left-[2px] top-0 h-full w-px bg-paper/30" />
            <span className="absolute right-[2px] top-full h-[3px] w-[2px] bg-red" />
        </span>
    )
}

/** A small hardback: its real cover (or ink with the title set on it), page block showing along the top and fore-edge, red ribbon out the bottom. */
function BookCover({ id, title }) {
    const cover = covers[id]
    return (
        <span
            aria-hidden="true"
            className="relative mb-3 mr-[6px] mt-[6px] block h-[78px] w-[56px] shrink-0"
        >
            <span className="absolute -top-[6px] left-0 h-[6px] w-full origin-bottom-left -skew-x-[45deg] border border-line-2 bg-paper" />
            <span className="absolute left-full top-0 h-full w-[6px] origin-top-left -skew-y-[45deg] border border-line-2 bg-paper" />
            <span className="absolute left-[38px] top-full h-[11px] w-[5px] bg-red [clip-path:polygon(0_0,100%_0,100%_100%,50%_70%,0_100%)]" />
            <span className="absolute inset-0 overflow-hidden rounded-[1px_2px_2px_1px] bg-ink">
                {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element -- static export
                    <img
                        src={`/books/${id}.webp`}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <>
                        <span className="absolute left-[10px] right-[4px] top-[12px] line-clamp-4 font-serif text-[9px] leading-[11px] text-paper">
                            {title}
                        </span>
                        <span className="absolute bottom-[10px] left-[10px] h-px w-[10px] bg-paper/50" />
                    </>
                )}
                <span className="absolute inset-y-0 left-[5px] w-px bg-black/25" />
            </span>
        </span>
    )
}

/**
 * "Lately I'm reading [Protocols]…"
 * The first book marked "reading" in the library data; the card shows it as an object.
 */
export function ReadingChip({ className }) {
    const [book, ...rest] = reading
    const more = rest.length ? `+${rest.length} more` : null

    return (
        <Chip
            className={className}
            glyph={<BookGlyph />}
            summary={`By ${book.author}. On the nightstand${more ? `, ${more}` : ""}.`}
            width={256}
            height={136}
            popover={
                <span className="flex items-start gap-4">
                    <BookCover id={book.id} title={book.title} />
                    <span className="block min-w-0 pt-1">
                        <span className="block font-serif text-small italic leading-[1.3] text-ink">
                            {book.title}
                        </span>
                        <span className="mt-1 block text-soft">
                            {book.author}
                        </span>
                        <span className="mt-3 block text-faint">
                            On the nightstand
                        </span>
                        {more ? (
                            <span className="block font-pixel text-pixel text-faint">
                                {more}
                            </span>
                        ) : null}
                    </span>
                </span>
            }
        >
            <span className="pr-[0.08em] italic">{book.title}</span>
        </Chip>
    )
}

/**
 * The song's page on Apple Music. A favourite with a link goes straight
 * there; one without starts on an Apple Music search and is swapped for the
 * song itself once the (cached) catalogue lookup finds it.
 */
function useAppleLink(track) {
    const [found, setFound] = useState(null)
    useEffect(() => {
        if (track.href) return
        let alive = true
        player.find(track).then((hit) => {
            if (alive && hit?.page) setFound({ id: track.id, page: hit.page })
        })
        return () => {
            alive = false
        }
    }, [track])
    if (track.href) return track.href
    return found?.id === track.id
        ? found.page
        : appleMusic(`${track.title} ${track.artist}`)
}

/**
 * "…and listening to [Vienna] on repeat."
 * The first of the songs I'm on repeat with (`records` in _data/library.js).
 * The card plays a 30-second preview and links to the song on Apple Music.
 * The bars only move when something is really playing: a preview, or the
 * ambient record.
 */
export function ListeningChip({ className }) {
    const track = records[0]
    const { enabled } = useSound()
    const { status, track: playing } = usePlayer()
    const mine = sameTrack(playing, track)
    const on = mine && (status === "playing" || status === "loading")
    const moving = enabled || (mine && status === "playing")
    const link = useAppleLink(track)
    const meta = [track.artist, track.album].filter(Boolean).join(" · ")

    return (
        <Chip
            className={className}
            glyph={<Equalizer active={moving} />}
            interactive
            title="What I'm listening to"
            width={264}
            height={150}
            popover={
                <span className="flex items-start gap-3">
                    <span aria-hidden="true" className="block shrink-0 pt-0.5">
                        <Disc
                            size={44}
                            className={cn(
                                "block",
                                moving && "animate-spin-slow",
                            )}
                        />
                    </span>
                    <span className="block min-w-0">
                        <span className="block font-serif text-small leading-[1.3] text-ink">
                            {track.title}
                        </span>
                        <span className="mt-1 block font-pixel text-pixel text-soft">
                            {meta}
                        </span>
                        <span className="mt-2 block text-soft">
                            On repeat lately
                        </span>
                        <span className="mt-2.5 flex items-center gap-3">
                            <button
                                type="button"
                                aria-pressed={on}
                                onClick={() => player.toggle(track)}
                                className="flex items-center gap-1.5 whitespace-nowrap text-ink transition-colors duration-[var(--duration-quick)] hover:text-red"
                            >
                                <span
                                    aria-hidden="true"
                                    className="grid size-5 place-items-center rounded-full border border-line-2"
                                >
                                    <svg
                                        viewBox="0 0 10 10"
                                        width="7"
                                        height="7"
                                        fill="currentColor"
                                    >
                                        {on ? (
                                            <path d="M2 1h2.2v8H2zM5.8 1H8v8H5.8z" />
                                        ) : (
                                            <path d="M2.5 1 9 5 2.5 9z" />
                                        )}
                                    </svg>
                                </span>
                                {mine && status === "loading"
                                    ? "Finding it…"
                                    : mine && status === "none"
                                      ? "No preview"
                                      : on
                                        ? "Pause"
                                        : "Play preview"}
                            </button>
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ink-link whitespace-nowrap text-soft hover:text-ink"
                            >
                                Apple Music
                            </a>
                        </span>
                    </span>
                </span>
            }
        >
            {track.title}
        </Chip>
    )
}
