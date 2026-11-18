"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

const subscribe = (onChange) => {
    const media = window.matchMedia(QUERY)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
}

/**
 * True when the user asked for less motion. Live: flipping the OS setting
 * while the page is open updates every component that uses it. One hook so
 * every component imports one thing.
 */
export function useReducedMotion() {
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(QUERY).matches,
        () => false,
    )
}
