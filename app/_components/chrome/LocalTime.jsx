"use client"

import { useSyncExternalStore } from "react"

import { site } from "@/app/_data/site"

const fmt = () =>
    new Date().toLocaleTimeString("en-GB", {
        timeZone: site.timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })

let listeners = new Set()
let timer = null
function subscribe(fn) {
    listeners.add(fn)
    if (!timer) timer = setInterval(() => listeners.forEach((l) => l()), 15_000)
    return () => {
        listeners.delete(fn)
        if (!listeners.size) {
            clearInterval(timer)
            timer = null
        }
    }
}

/** The owner's local time (IST), ticking. Renders "--:--" on the server. */
export default function LocalTime({ className }) {
    const time = useSyncExternalStore(subscribe, fmt, () => "--:--")
    return (
        <time className={className} suppressHydrationWarning>
            {time}
        </time>
    )
}
