"use client"

import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { EIK } from "@/app/_components/brand/eik-geometry"
import Flame from "@/app/_components/brand/Flame"
import { ease } from "@/app/_lib/motion"
import { useReducedMotion } from "@/app/_lib/useReducedMotion"

const NAME = [..."Sarthak"]

// The logo is drawn in Newsreader font units (2000 per em), baseline at y = 0,
// so it can sit inline with the heading at exactly the heading's size.
const UPM = 2000
const [, top, vbW, vbH] = EIK.viewBox.split(" ").map(Number)
const LOGO = {
    w: `${vbW / UPM}em`,
    h: `${vbH / UPM}em`,
    drop: `${(vbH + top) / UPM}em`,
}

const GLYPHS = [
    { d: EIK.e, x: 0 },
    { d: EIK.i, x: EIK.iX },
    { d: EIK.k, x: EIK.kX },
]

/**
 * "Sarthak" in the hero. Hover it (or tap it) and the name's letters flip away
 * one after another while the line closes up, the eik wordmark rises letter by
 * letter, and the red flame lands last on the i. Leave and it plays back.
 */
export default function NameSwap() {
    const reduced = useReducedMotion()
    const [on, setOn] = useState(false)
    const [w, setW] = useState(null)
    const name = useRef(null)
    const logo = useRef(null)
    const via = useRef("touch") // how the last press came in

    // Measure both words (fonts can load late, so keep watching).
    useEffect(() => {
        const a = name.current
        const b = logo.current
        if (!a || !b) return
        const ro = new ResizeObserver(() =>
            setW({
                name: a.offsetWidth,
                logo: b.getBoundingClientRect().width,
            }),
        )
        ro.observe(a)
        ro.observe(b)
        return () => ro.disconnect()
    }, [])

    const d = reduced ? 0 : 1 // scales every duration and delay
    const n = NAME.length

    return (
        <span
            // cursor-pointer on touch screens: iOS only sends taps to things it thinks are clickable
            className="relative inline-block cursor-default touch-manipulation whitespace-nowrap align-baseline [-webkit-tap-highlight-color:transparent] pointer-coarse:cursor-pointer"
            style={{
                width: w ? (on ? w.logo : w.name) : undefined,
                // close up as the name leaves; open up as eik sinks
                transition: `width ${(on ? 380 : 320) * d}ms cubic-bezier(0.45, 0, 0.2, 1) ${(on ? 40 : 90) * d}ms`,
            }}
            onPointerEnter={(e) => e.pointerType === "mouse" && setOn(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setOn(false)}
            // Touch and pen toggle on tap. The pointer type is taken from the
            // press, since a tap's `click` can report "mouse" (or nothing) on iOS.
            onPointerDown={(e) => (via.current = e.pointerType)}
            onClick={() => via.current !== "mouse" && setOn((v) => !v)}
        >
            <span className="sr-only">Sarthak</span>

            {/* the wordmark, overlaid at the start of the word and taking no width */}
            <svg
                ref={logo}
                aria-hidden
                viewBox={EIK.viewBox}
                className="pointer-events-none inline-block overflow-visible"
                style={{
                    width: LOGO.w,
                    height: LOGO.h,
                    verticalAlign: `-${LOGO.drop}`,
                    marginRight: `-${LOGO.w}`,
                }}
                fill="currentColor"
            >
                {GLYPHS.map((g, j) => (
                    <motion.g
                        key={j}
                        initial={false}
                        animate={
                            on ? { y: 0, opacity: 1 } : { y: 520, opacity: 0 }
                        }
                        transition={
                            on
                                ? {
                                      duration: 0.42 * d,
                                      ease: ease.drop,
                                      delay: (0.22 + j * 0.06) * d,
                                  }
                                : {
                                      duration: 0.14 * d,
                                      ease: ease.exit,
                                      delay: (2 - j) * 0.025 * d,
                                  }
                        }
                    >
                        <g transform="scale(1 -1)">
                            <path transform={`translate(${g.x} 0)`} d={g.d} />
                        </g>
                    </motion.g>
                ))}
                <motion.g
                    initial={false}
                    animate={
                        on ? { y: 0, opacity: 1 } : { y: -900, opacity: 0 }
                    }
                    transition={
                        on
                            ? reduced
                                ? { duration: 0 }
                                : {
                                      y: {
                                          type: "spring",
                                          stiffness: 520,
                                          damping: 22,
                                          delay: 0.5,
                                      },
                                      opacity: { duration: 0.08, delay: 0.5 },
                                  }
                            : { duration: 0.14 * d, ease: ease.exit }
                    }
                >
                    <g transform="scale(1 -1)">
                        <Flame />
                    </g>
                </motion.g>
            </svg>

            <span
                ref={name}
                aria-hidden
                className="inline-block [perspective:600px]"
            >
                {NAME.map((c, j) => (
                    <motion.span
                        key={j}
                        className="inline-block origin-[50%_70%]"
                        initial={false}
                        animate={
                            on
                                ? { y: "-0.22em", rotateX: 70, opacity: 0 }
                                : { y: 0, rotateX: 0, opacity: 1 }
                        }
                        transition={
                            on
                                ? {
                                      duration: 0.15 * d,
                                      ease: ease.exit,
                                      delay: (n - 1 - j) * 0.02 * d, // the tail goes first, so the full stop chases it
                                  }
                                : {
                                      duration: 0.34 * d,
                                      ease: ease.drop,
                                      delay: (0.16 + j * 0.03) * d,
                                  }
                        }
                    >
                        {c}
                    </motion.span>
                ))}
            </span>
        </span>
    )
}
