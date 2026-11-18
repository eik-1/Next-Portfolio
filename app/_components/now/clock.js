"use client"

import { useSyncExternalStore } from "react"

import { site } from "@/app/_data/site"

/**
 * One shared minute tick for every clock in the Now family.
 * The snapshot is "minutes since the epoch", so components only re-render
 * when the minute actually changes. `null` on the server (no time there).
 */
const listeners = new Set()
let timer = null
let last = null

const stamp = () => Math.floor(Date.now() / 60_000)

function subscribe(fn) {
    listeners.add(fn)
    if (!timer) {
        last = stamp()
        timer = setInterval(() => {
            const now = stamp()
            if (now === last) return
            last = now
            listeners.forEach((l) => l())
        }, 1000)
    }
    return () => {
        listeners.delete(fn)
        if (!listeners.size) {
            clearInterval(timer)
            timer = null
        }
    }
}

export function useMinute() {
    return useSyncExternalStore(subscribe, stamp, () => null)
}

const formatters = new Map()
function formatter(timeZone) {
    const key = timeZone ?? "local"
    if (!formatters.has(key)) {
        formatters.set(key, {
            parts: new Intl.DateTimeFormat("en-GB", {
                timeZone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23",
            }),
            label: new Intl.DateTimeFormat("en-GB", {
                timeZone,
                weekday: "short",
                day: "numeric",
                month: "short",
            }),
        })
    }
    return formatters.get(key)
}

/**
 * Wall-clock reading for a minute stamp in a time zone (omit `timeZone` for
 * the visitor's own). Pure for a given stamp, so it is safe during render.
 */
export function readClock(minute, timeZone) {
    const date = new Date(minute * 60_000)
    const { parts, label } = formatter(timeZone)
    const p = {}
    for (const { type, value } of parts.formatToParts(date)) p[type] = value
    const hour = Number(p.hour) % 24
    const wall =
        Date.UTC(
            Number(p.year),
            Number(p.month) - 1,
            Number(p.day),
            hour,
            Number(p.minute),
        ) / 60_000
    return {
        hh: String(hour).padStart(2, "0"),
        mm: p.minute,
        hour,
        minute: Number(p.minute),
        date: label.format(date).replace(",", ""), // "Mon 16 Nov"
        iso: `${p.year}-${p.month}-${p.day}T${String(hour).padStart(2, "0")}:${p.minute}`,
        offset: wall - minute, // minutes ahead of UTC
    }
}

/** The owner's clock, ticking. `null` until hydrated. */
export function useClock(timeZone = site.timezone) {
    const minute = useMinute()
    return minute === null ? null : readClock(minute, timeZone)
}

/**
 * What the hour means: which sky to draw and one plain line about the owner.
 * sky: "day" | "dusk" | "night" · body: "sun" | "moon"
 */
export function phaseOf(hour) {
    if (hour >= 23 || hour < 6)
        return {
            sky: "night",
            body: "moon",
            line: "It's late here, I'm probably reading.",
        }
    if (hour < 10)
        return {
            sky: hour < 7 ? "dusk" : "day",
            body: "sun",
            line: "Morning here, easing into the day.",
        }
    if (hour < 19)
        return {
            sky: hour >= 18 ? "dusk" : "day",
            body: "sun",
            line: "Working hours.",
        }
    return { sky: "night", body: "moon", line: "Evening here, winding down." }
}

/**
 * How far the sun (06→19) or the moon (19→06) is across the sky, 0 → 1.
 */
export function skyProgress(hour, minute) {
    const h = hour + minute / 60
    if (h >= 6 && h < 19) return (h - 6) / 13
    return ((h - 19 + 24) % 24) / 11
}

/** "4h 30m ahead of me" for a difference in minutes (visitor − owner). */
export function describeOffset(diff) {
    if (diff === 0) return "same time as me"
    const abs = Math.abs(diff)
    const h = Math.floor(abs / 60)
    const m = abs % 60
    const span = [h ? `${h}h` : "", m ? `${m}m` : ""].filter(Boolean).join(" ")
    return `${span} ${diff > 0 ? "ahead of" : "behind"} me`
}
