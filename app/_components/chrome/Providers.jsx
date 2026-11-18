"use client"

import { MotionConfig } from "motion/react"
import { useEffect } from "react"

import { sound } from "@/app/_lib/sound"

/** Honour the OS reduced-motion setting everywhere, and restore the saved sound choice. */
export default function Providers({ children }) {
    useEffect(() => {
        sound.init()
    }, [])
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
