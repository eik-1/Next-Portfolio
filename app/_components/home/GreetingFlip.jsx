"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { ease } from "@/app/_lib/motion"
import { useReducedMotion } from "@/app/_lib/useReducedMotion"

// "Hey" flips through five other ways of saying it, then lands back on "Hey".
const WORDS = [
    { text: "Hey", lang: "en" },
    { text: "नमस्ते", lang: "hi" },
    { text: "Hola", lang: "es" },
    { text: "Salut", lang: "fr" },
    { text: "Ciao", lang: "it" },
    { text: "やあ", lang: "ja" },
    { text: "Hey", lang: "en" },
]
const START_MS = 450 // let the page settle first
const HOLD_MS = 300 // time on each word
const FLIP_S = 0.22

// Once per page load: client-side navigation back home doesn't replay it.
let played = false

/**
 * The loading moment on the home page. The surrounding text glides as each
 * word's width changes, then the width goes back to auto. Screen readers and
 * reduced-motion visitors only ever get "Hey".
 */
export default function GreetingFlip() {
    const reduced = useReducedMotion()
    const [i, setI] = useState(0)
    const [width, setWidth] = useState(null)
    const sizer = useRef([])

    useEffect(() => {
        if (reduced || played) return
        const timers = []
        const at = (n) => {
            const w = sizer.current[n]?.offsetWidth
            setI(n)
            setWidth(w || null)
            if (n === WORDS.length - 1) {
                played = true
                timers.push(
                    setTimeout(() => setWidth(null), FLIP_S * 1000 + 50),
                )
                return
            }
            timers.push(setTimeout(() => at(n + 1), HOLD_MS))
        }
        timers.push(
            setTimeout(() => {
                setWidth(sizer.current[0]?.offsetWidth ?? null)
                requestAnimationFrame(() => at(1))
            }, START_MS),
        )
        return () => timers.forEach(clearTimeout)
    }, [reduced])

    const word = WORDS[i]
    return (
        <>
            <span className="sr-only">Hey</span>
            <span
                aria-hidden
                className="relative inline-block whitespace-nowrap align-baseline [perspective:600px]"
                style={{
                    width: width ?? undefined,
                    transition:
                        width === null
                            ? undefined
                            : "width 220ms var(--ease-standard)",
                }}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={i}
                        lang={word.lang}
                        className="inline-block origin-[50%_60%]"
                        initial={{ rotateX: -80, opacity: 0, y: "0.12em" }}
                        animate={{ rotateX: 0, opacity: 1, y: 0 }}
                        exit={{ rotateX: 80, opacity: 0, y: "-0.12em" }}
                        transition={{ duration: FLIP_S, ease: ease.flip }}
                    >
                        {word.text}
                    </motion.span>
                </AnimatePresence>
                {/* invisible copies, measured for the width of each word */}
                <span className="pointer-events-none invisible absolute left-0 top-0">
                    {WORDS.map((w, n) => (
                        <span
                            key={n}
                            lang={w.lang}
                            ref={(el) => (sizer.current[n] = el)}
                            className="absolute left-0 top-0 whitespace-nowrap"
                        >
                            {w.text}
                        </span>
                    ))}
                </span>
            </span>
        </>
    )
}
