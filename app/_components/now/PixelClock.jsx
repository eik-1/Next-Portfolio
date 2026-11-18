"use client"

import { useState } from "react"

import { site } from "@/app/_data/site"
import { cn } from "@/app/_lib/cn"
import { sound } from "@/app/_lib/sound"

import {
    describeOffset,
    phaseOf,
    readClock,
    skyProgress,
    useMinute,
} from "./clock"
import { Moon, Sun } from "./pixels"
import Tile from "./Tile"

// Short name of `site.timezone`. Intl only gives "GMT+5:30" for it in most locales.
const ZONE = "IST"

const STRIP_W = 176
const STRIP_H = 44
const GLYPH = 11

// Flat colours only. Day is the light tone and night the dark tone in both themes.
const SKY = {
    day: "border-line-2 bg-paper dark:border-transparent dark:bg-ink",
    dusk: "border-line-2 bg-tile-2",
    night: "border-transparent bg-ink dark:border-line-2 dark:bg-paper",
}
const BODY = {
    day: "text-red",
    dusk: "text-red",
    night: "text-paper dark:text-ink",
}
const STARS = [
    [26, 12],
    [71, 7],
    [118, 20],
    [152, 9],
]

/** A strip of sky: the sun or the moon travels across it through the day. */
function Sky({ clock }) {
    const phase = clock ? phaseOf(clock.hour) : { sky: "day", body: "sun" }
    const t = clock ? skyProgress(clock.hour, clock.minute) : 0.5
    const x = Math.round(8 + t * (STRIP_W - 16 - GLYPH))
    const y = Math.round(STRIP_H - GLYPH - 6 - Math.sin(Math.PI * t) * 20)
    const Body = phase.body === "moon" ? Moon : Sun

    return (
        <div
            aria-hidden="true"
            className={cn(
                "relative overflow-hidden rounded-sm border transition-colors duration-[var(--duration-slow)] ease-[var(--ease-standard)]",
                SKY[phase.sky],
            )}
            style={{ width: STRIP_W, height: STRIP_H }}
        >
            {phase.sky === "night"
                ? STARS.map(([left, top]) => (
                      <span
                          key={left}
                          className="absolute size-[2px] bg-paper opacity-60 dark:bg-ink"
                          style={{ left, top }}
                      />
                  ))
                : null}
            <span
                className={cn(
                    "absolute left-0 top-0 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)]",
                    BODY[phase.sky],
                )}
                style={{ transform: `translate(${x}px, ${y}px)` }}
            >
                <Body className="block" />
            </span>
        </div>
    )
}

/**
 * My local time in pixels, with the sky it comes with. "Yours" swaps it for
 * the visitor's own clock and says how far apart we are.
 */
export default function PixelClock() {
    const [whose, setWhose] = useState("mine")
    const minute = useMinute()

    const mine = minute === null ? null : readClock(minute, site.timezone)
    const yours = minute === null ? null : readClock(minute)
    const clock = whose === "mine" ? mine : yours
    const aside =
        whose === "mine"
            ? ZONE
            : yours
              ? describeOffset(yours.offset - mine.offset)
              : null

    return (
        <Tile
            caption={whose === "mine" ? "My time" : "Your time"}
            aside={aside}
        >
            <div className="flex h-full flex-col items-center justify-center gap-5 pb-8">
                <Sky clock={clock} />
                <div className="text-center">
                    <time
                        dateTime={clock?.iso}
                        className="block font-pixel text-[44px] leading-none text-ink"
                    >
                        {clock ? clock.hh : "--"}
                        <span className="animate-blink">:</span>
                        {clock ? clock.mm : "--"}
                    </time>
                    <p className="mt-3 font-pixel text-pixel text-soft">
                        {clock?.date ?? " "}
                    </p>
                </div>
            </div>

            <div
                role="group"
                aria-label="Whose time"
                className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5 font-sans text-ui"
            >
                {["mine", "yours"].map((w, i) => (
                    <span key={w} className="flex items-center gap-1.5">
                        {i > 0 ? (
                            <span aria-hidden="true" className="text-faint">
                                ·
                            </span>
                        ) : null}
                        <button
                            type="button"
                            aria-pressed={whose === w}
                            onClick={() => {
                                sound.ui("tick")
                                setWhose(w)
                            }}
                            className={cn(
                                "capitalize transition-colors duration-[var(--duration-quick)] ease-[var(--ease-standard)]",
                                whose === w
                                    ? "text-ink"
                                    : "text-soft hover:text-ink",
                            )}
                        >
                            {w}
                        </button>
                    </span>
                ))}
            </div>
        </Tile>
    )
}
