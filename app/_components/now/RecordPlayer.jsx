"use client"

import { motion, useAnimationFrame, useMotionValue } from "motion/react"
import { useRef, useState } from "react"

import { records } from "@/app/_data/library"
import { cn } from "@/app/_lib/cn"
import { duration, spring } from "@/app/_lib/motion"
import { player, sameTrack, usePlayer } from "@/app/_lib/player"
import { sound } from "@/app/_lib/sound"
import { useReducedMotion } from "@/app/_lib/useReducedMotion"

import Disc from "./Disc"
import Tile from "./Tile"

const SPEED = 200 // 33⅓ rpm, in degrees per second
const SPIN_UP = 1.4 // seconds for the platter to reach speed
const NEEDLE_DOWN = 36.5 // degrees the arm swings to land on the outer grooves

/**
 * Platter rotation with weight: a steady push up to 33⅓ rpm, then friction
 * back down to rest. Returns a motion value in degrees.
 */
function useSpin(active) {
    const rotate = useMotionValue(0)
    const velocity = useRef(0)

    useAnimationFrame((_, delta) => {
        const dt = Math.min(delta, 50) / 1000
        let v = velocity.current
        if (active) v = Math.min(SPEED, v + (SPEED / SPIN_UP) * dt)
        else if (v > 0) v = v < 3 ? 0 : v * Math.exp(-1.9 * dt)
        else return
        velocity.current = v
        rotate.set((rotate.get() + v * dt) % 360)
    })

    return rotate
}

// Two flat slivers of light on the vinyl. They stay put while the record turns.
function sliver(angle, spread, r1 = 23, r2 = 60) {
    const at = (r, deg) => {
        const t = (deg * Math.PI) / 180
        return `${(62 + r * Math.cos(t)).toFixed(2)} ${(62 + r * Math.sin(t)).toFixed(2)}`
    }
    const a = angle - spread
    const b = angle + spread
    return `M${at(r1, a)}L${at(r2, a)}A${r2} ${r2} 0 0 1 ${at(r2, b)}L${at(r1, b)}A${r1} ${r1} 0 0 0 ${at(r1, a)}Z`
}
const SHEEN = sliver(-52, 7) + sliver(128, 7)

const control = cn(
    "grid size-8 shrink-0 place-items-center rounded-full border border-line-2 bg-paper text-ink",
    "transition-[background-color,scale] duration-[var(--duration-quick)] ease-[var(--ease-standard)]",
    "hover:bg-tile-2 active:scale-95",
)

/**
 * The record player. The readout is a song I'm on repeat with (`records` in
 * _data/library.js), and "next" flips through them.
 * Drop the needle (click the arm, the record or the play button) and a
 * 30-second preview of that song plays; lift it and it stops. The ambient
 * record lives in the header now. Sound only ever starts from a press.
 */
export default function RecordPlayer() {
    const { status, track: playing } = usePlayer()
    const reduced = useReducedMotion()
    const [skip, setSkip] = useState(0)

    const shown = records[skip % records.length]
    const mine = sameTrack(playing, shown)
    const on = mine && (status === "playing" || status === "loading") // needle down
    const missing = mine && status === "none"
    const rotate = useSpin(on && status === "playing" && !reduced)

    const toggle = () => player.toggle(shown)
    const next = () => {
        sound.ui("press")
        const after = records[(skip + 1) % records.length]
        setSkip((s) => s + 1)
        // keep the music going: if a song was playing, play the next one
        if (playing && status === "playing") player.play(after)
    }

    const aside = on ? (
        <>
            <span
                aria-hidden="true"
                className="mr-1.5 inline-block size-1.5 rounded-full bg-red align-middle"
            />
            {status === "loading" ? "finding it" : "preview"}
        </>
    ) : missing ? (
        "no preview"
    ) : null

    return (
        <Tile caption="Listening" aside={aside}>
            <div className="flex h-full flex-col">
                <div className="flex min-h-0 flex-1 items-center justify-center">
                    <div className="relative h-[168px] w-[224px] shrink-0 scale-[0.84] @[272px]:scale-100">
                        {/* plinth and platter */}
                        <div className="absolute inset-0 rounded-[16px] border border-line-2 bg-paper dark:bg-tile-2" />
                        <div className="absolute left-[14px] top-[14px] size-[140px] rounded-full border border-line-2 bg-tile-2 dark:bg-tile" />

                        {/* the record */}
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-hidden="true"
                            onClick={toggle}
                            className="absolute left-[22px] top-[22px] size-[124px] rounded-full"
                        >
                            <motion.div
                                style={{ rotate }}
                                className="size-full"
                            >
                                <Disc className="block" />
                            </motion.div>
                        </button>
                        <svg
                            viewBox="0 0 124 124"
                            aria-hidden="true"
                            className="pointer-events-none absolute left-[22px] top-[22px] size-[124px]"
                        >
                            <path d={SHEEN} fill="#fff" fillOpacity="0.06" />
                        </svg>

                        {/* arm rest, pivot, switch */}
                        <div className="absolute left-[186px] top-[97px] h-[6px] w-[12px] rounded-[2px] border border-line-2 bg-tile-2 dark:bg-tile" />
                        <div className="absolute left-[178px] top-[22px] size-[28px] rounded-full border border-line-2 bg-tile-2 dark:bg-tile" />
                        <div className="absolute left-[170px] top-[142px] h-[10px] w-[20px] rounded-full border border-line-2">
                            <span
                                className={cn(
                                    "absolute left-[1px] top-[1px] size-[6px] rounded-full bg-ink transition-transform duration-[var(--duration-base)] ease-[var(--ease-standard)]",
                                    on && "translate-x-[10px]",
                                )}
                            />
                        </div>
                        <div
                            className={cn(
                                "absolute left-[198px] top-[144px] size-[6px] rounded-full transition-colors duration-[var(--duration-base)]",
                                on ? "bg-red" : "bg-line-2",
                            )}
                        />

                        {/* tonearm: pivots at 14px 26px of its own box */}
                        <motion.button
                            type="button"
                            tabIndex={-1}
                            aria-hidden="true"
                            onClick={toggle}
                            className="absolute left-[178px] top-[10px] h-[136px] w-[28px]"
                            style={{ transformOrigin: "14px 26px" }}
                            initial={false}
                            animate={{ rotate: on ? NEEDLE_DOWN : 0 }}
                            whileHover={on ? undefined : { rotate: 4 }}
                            transition={spring.platter}
                        >
                            <svg
                                viewBox="0 0 28 136"
                                width="28"
                                height="136"
                                className="block overflow-visible"
                            >
                                <rect
                                    x="8"
                                    y="1"
                                    width="12"
                                    height="15"
                                    rx="2.5"
                                    className="fill-ink"
                                />
                                <line
                                    x1="14"
                                    y1="14"
                                    x2="14"
                                    y2="101"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    className="stroke-faint"
                                />
                                <g transform="rotate(18 14 100)">
                                    <line
                                        x1="19"
                                        y1="106"
                                        x2="25"
                                        y2="104"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        className="stroke-faint"
                                    />
                                    <rect
                                        x="9"
                                        y="99"
                                        width="10"
                                        height="19"
                                        rx="2"
                                        fill="#dddcd6"
                                        stroke="#111110"
                                        strokeOpacity="0.4"
                                        strokeWidth="0.75"
                                    />
                                </g>
                                <circle
                                    cx="14"
                                    cy="26"
                                    r="6.5"
                                    className="fill-ink"
                                />
                                <circle
                                    cx="14"
                                    cy="26"
                                    r="2"
                                    className="fill-paper"
                                />
                            </svg>
                        </motion.button>
                    </div>
                </div>

                {/* transport */}
                <div className="flex items-center gap-3 px-4 pb-4">
                    <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`Play a preview of ${shown.title}`}
                        onClick={toggle}
                        className={control}
                    >
                        <svg
                            viewBox="0 0 10 10"
                            width="10"
                            height="10"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            {on ? (
                                <path d="M2 1h2.2v8H2zM5.8 1H8v8H5.8z" />
                            ) : (
                                <path d="M2.5 1 9 5 2.5 9z" />
                            )}
                        </svg>
                    </button>
                    <p
                        className="min-w-0 flex-1 font-pixel text-pixel"
                        aria-live="polite"
                    >
                        <motion.span
                            key={shown.id ?? shown.title}
                            className="block"
                            initial={skip === 0 ? false : { opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: duration.quick }}
                        >
                            <span className="block truncate text-ink">
                                {shown.title}
                            </span>
                            <span className="block truncate text-soft">
                                {shown.artist}
                            </span>
                        </motion.span>
                    </p>
                    <button
                        type="button"
                        aria-label="Next track"
                        onClick={next}
                        className={control}
                    >
                        <svg
                            viewBox="0 0 10 10"
                            width="10"
                            height="10"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M1 1.2 6.4 5 1 8.8zM7.6 1.2H9v7.6H7.6z" />
                        </svg>
                    </button>
                </div>
            </div>
        </Tile>
    )
}
