"use client"

import { cn } from "@/app/_lib/cn"
import { player, usePlayer } from "@/app/_lib/player"
import { useSound } from "@/app/_lib/sound"

// a 7×7 pixel record, its label, and the four places a glint sits as it turns
const DISC = [
    "..###..",
    ".#####.",
    "#######",
    "#######",
    "#######",
    ".#####.",
    "..###..",
]
const GLINT = [
    [3, 1],
    [5, 3],
    [3, 5],
    [1, 3],
]

/**
 * The ambient record's switch, in the header: a tiny pixel record. Off, it's
 * grey and still. On, it's ink with a red label, and a glint steps round it
 * a quarter-turn at a time (pixels never rotate, so it stays crisp). It's
 * the only thing that starts the ambient music. Turning it on stops any song
 * preview; a preview started later steps it aside until it's done.
 */
export default function AmbientButton() {
    const { enabled, setEnabled } = useSound()
    const { status } = usePlayer()
    const audible = enabled && status !== "playing"

    const toggle = () => {
        if (!enabled) player.stop()
        setEnabled(!enabled)
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={enabled}
            aria-label="Ambient music"
            title={enabled ? "Ambient music: on" : "Ambient music"}
            className="group -m-2 grid place-items-center p-2"
        >
            <svg
                viewBox="0 0 7 7"
                width="14"
                height="14"
                aria-hidden="true"
                shapeRendering="crispEdges"
                className="block"
            >
                <g
                    className={cn(
                        "transition-colors duration-[var(--duration-quick)]",
                        audible
                            ? "fill-ink"
                            : "fill-faint group-hover:fill-soft",
                    )}
                >
                    {DISC.flatMap((row, y) =>
                        [...row].map((c, x) =>
                            c === "#" ? (
                                <rect
                                    key={`${x}-${y}`}
                                    x={x}
                                    y={y}
                                    width="1"
                                    height="1"
                                />
                            ) : null,
                        ),
                    )}
                </g>
                <rect
                    x="2"
                    y="2"
                    width="3"
                    height="3"
                    className={audible ? "fill-red" : "fill-paper"}
                />
                <rect
                    x="3"
                    y="3"
                    width="1"
                    height="1"
                    className={audible ? "fill-paper" : "fill-faint"}
                />
                {audible
                    ? GLINT.map(([x, y], i) => (
                          <rect
                              key={i}
                              x={x}
                              y={y}
                              width="1"
                              height="1"
                              className="animate-record-glint fill-soft opacity-0"
                              style={{ animationDelay: `${i * 0.4 - 1.6}s` }}
                          />
                      ))
                    : null}
            </svg>
        </button>
    )
}
