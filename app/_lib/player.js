"use client"

/**
 * Song previews: play a 30-second clip of any track by its title and artist.
 *
 * The clip comes from Apple's public iTunes Search API (no key, no account),
 * so any song in the list works. One clip plays at a time. While a clip plays, the ambient
 * record steps aside and comes back after.
 *
 *   import { player, usePlayer } from "@/app/_lib/player"
 *   player.toggle(track)            // play, or pause if this track is playing
 *   const { track, status } = usePlayer()
 *   // status: "idle" | "loading" | "playing" | "none" (no preview found)
 */
import { useSyncExternalStore } from "react"

import { sound } from "@/app/_lib/sound"

let state = { track: null, status: "idle", url: null }
const listeners = new Set()
const found = new Map() // "title|artist" → { url, page } | null
let audio = null
let noneTimer = 0

const set = (next) => {
    state = { ...state, ...next }
    listeners.forEach((l) => l())
}

const keyOf = (t) => `${t.title}|${t.artist}`.toLowerCase()

/** True when two tracks are the same song. */
export const sameTrack = (a, b) => Boolean(a && b && keyOf(a) === keyOf(b))
const clean = (s = "") =>
    s
        .toLowerCase()
        .replace(/\(.*?\)|\[.*?\]/g, "")
        .replace(/[^a-z0-9 ]/g, "")
        .trim()

/**
 * Find a preview for a track: by its Apple Music id when it has one,
 * otherwise by searching title and artist (preferring the studio cut).
 */
async function lookup(track) {
    const key = keyOf(track)
    if (found.has(key)) return found.get(key)
    let hit = null
    try {
        // a song pinned to its Apple Music id: exact, no guessing
        if (track.apple) {
            const res = await fetch(
                `https://itunes.apple.com/lookup?id=${track.apple}`,
            )
            const r = (await res.json()).results?.[0]
            if (r?.previewUrl) {
                hit = {
                    url: r.previewUrl,
                    page: r.trackViewUrl?.replace(/[?&]uo=\d+/, ""),
                }
                found.set(key, hit)
                return hit
            }
        }
        const term = encodeURIComponent(`${track.title} ${track.artist}`)
        const res = await fetch(
            `https://itunes.apple.com/search?term=${term}&entity=song&limit=10`,
        )
        const { results = [] } = await res.json()
        const title = clean(track.title)
        const artist = clean(track.artist)
        const score = (r) => {
            const name = clean(r.trackName)
            let s = 0
            if (
                clean(r.artistName).includes(artist) ||
                artist.includes(clean(r.artistName))
            )
                s += 4
            if (name === title) s += 4
            else if (name.startsWith(title)) s += 2
            // the version I'd actually play, not a live take or a karaoke cover
            if (
                /live|karaoke|remix|instrumental|cover/i.test(r.trackName) &&
                !/live|remix/i.test(track.title)
            )
                s -= 3
            return s
        }
        const best = results
            .filter((r) => r.previewUrl)
            .sort((a, b) => score(b) - score(a))[0]
        if (best && score(best) >= 4)
            hit = {
                url: best.previewUrl,
                page: best.trackViewUrl?.replace(/[?&]uo=\d+/, ""), // the song on Apple Music
            }
    } catch {
        /* offline or blocked: no preview */
    }
    found.set(key, hit)
    return hit
}

function stop() {
    if (audio) {
        audio.pause()
        audio.removeAttribute("src")
        audio.load()
    }
    sound.resumeAmbient()
    set({ track: null, status: "idle", url: null })
}

async function play(track) {
    clearTimeout(noneTimer)
    if (audio) audio.pause()
    set({ track, status: "loading", url: null })
    const hit = await lookup(track)
    if (state.track !== track) return // something else was asked for meanwhile
    if (!hit) {
        set({ status: "none" })
        noneTimer = setTimeout(
            () => state.track === track && set({ track: null, status: "idle" }),
            2400,
        )
        return
    }
    if (!audio) {
        audio = new Audio()
        audio.preload = "auto"
        audio.addEventListener("ended", stop)
        audio.addEventListener("error", () => state.status !== "idle" && stop())
    }
    audio.src = hit.url
    audio.volume = 0.8
    sound.pauseAmbient()
    try {
        await audio.play()
        set({ status: "playing", url: hit.page })
    } catch {
        stop() // the browser refused (no gesture): stay quiet
    }
}

export const player = {
    /** Look a song up (cached): { url: preview, page: Apple Music } or null. */
    find: lookup,
    play,
    stop,
    /** Play this track, or stop it if it is the one playing or loading. */
    toggle(track) {
        if (
            sameTrack(state.track, track) &&
            (state.status === "playing" || state.status === "loading")
        )
            stop()
        else play(track)
    },
    subscribe(fn) {
        listeners.add(fn)
        return () => listeners.delete(fn)
    },
}

const IDLE = { track: null, status: "idle", url: null }

/** The preview player's state: { track, status, url } (url: the song's page). */
export function usePlayer() {
    return useSyncExternalStore(
        player.subscribe,
        () => state,
        () => IDLE,
    )
}
