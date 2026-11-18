"use client"

/**
 * eik sound engine — everything is synthesised with the Web Audio API.
 * No audio files. Off by default; the choice is remembered in localStorage.
 *
 *   import { sound, useSound } from "@/app/_lib/sound"
 *   sound.ui("tick")            // short UI blip (no-op while sound is off)
 *   sound.scratch(velocity)     // vinyl scratch, velocity in turns/sec (signed)
 *   sound.setEnabled(true)      // starts the ambient record (the header button)
 *   sound.pauseAmbient() / sound.resumeAmbient()   // song previews step it aside
 *   const { enabled, toggle } = useSound()
 *
 * UI blips are adapted from Bencho sounds (MIT © 2026 Lorenzo Cabra,
 * https://github.com/cabralorenzo/bencho).
 */

import { useSyncExternalStore } from "react"

const UI = {
    tick: [{ hz: 196, to: 130, ms: 150, gain: 0.07, wave: "sine", cut: 900 }],
    press: [
        { hz: 480, to: 300, glide: 18, ms: 23, gain: 0.064, atk: 1 },
        { hz: 600, to: 900, glide: 40, ms: 61, gain: 0.015, atk: 12 },
    ],
    open: [
        {
            hz: 397,
            to: 276,
            ms: 205,
            gain: 0.05,
            wave: "sine",
            cut: 820,
            atk: 60,
        },
    ],
    close: [
        {
            hz: 330,
            to: 247,
            ms: 88,
            gain: 0.03,
            wave: "sine",
            cut: 720,
            atk: 8,
        },
    ],
    latch: [
        { hz: 256, ms: 90, gain: 0.05, wave: "square", cut: 2400, atk: 10 },
    ],
    lamp: [
        { hz: 2500, ms: 6, gain: 0.03, noise: "lowpass", q: -3, atk: 1 },
        {
            hz: 1760,
            to: 1500,
            ms: 40,
            gain: 0.03,
            wave: "triangle",
            cut: 3000,
            atk: 1,
        },
        {
            hz: 208,
            to: 165,
            ms: 120,
            gain: 0.03,
            wave: "sine",
            cut: 520,
            atk: 10,
            at: 10,
        },
    ],
    landed: [
        { hz: 784, ms: 120, gain: 0.035, wave: "sine", cut: 2600, atk: 4 },
        {
            hz: 1047,
            ms: 130,
            gain: 0.035,
            wave: "sine",
            cut: 2800,
            atk: 4,
            at: 70,
        },
        {
            hz: 1319,
            ms: 420,
            gain: 0.04,
            wave: "sine",
            cut: 3000,
            atk: 5,
            at: 140,
        },
    ],
}

const KEY = "eik:sound"
let ctx = null
let master = null
let enabled = false
let ambient = null
let held = false // a song preview is playing, so the ambient record waits
const listeners = new Set()
let noiseBuf = null

function emit() {
    listeners.forEach((l) => l())
}

function audio() {
    if (typeof window === "undefined") return null
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext
        if (!AC) return null
        ctx = new AC()
        master = ctx.createGain()
        master.gain.value = 1
        master.connect(ctx.destination)
    }
    if (ctx.state === "suspended") ctx.resume()
    return ctx
}

function noise(c) {
    if (noiseBuf) return noiseBuf
    noiseBuf = c.createBuffer(1, Math.floor(c.sampleRate * 2), c.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    return noiseBuf
}

function schedule(c, notes, when, volume = 1) {
    for (const n of notes) {
        const t0 = when + (n.at ?? 0) / 1000
        const t1 = t0 + n.ms / 1000
        const tg = n.glide ? t0 + n.glide / 1000 : t1
        let src
        let head
        if (n.noise) {
            src = c.createBufferSource()
            src.buffer = noise(c)
            src.loop = true
            const f = c.createBiquadFilter()
            f.type = n.noise
            f.frequency.setValueAtTime(n.hz, t0)
            if (n.q !== undefined) f.Q.value = n.q
            src.connect(f)
            head = f
        } else {
            src = c.createOscillator()
            src.type = n.wave ?? "sine"
            src.frequency.setValueAtTime(n.hz, t0)
            if (n.to) src.frequency.exponentialRampToValueAtTime(n.to, tg)
            head = src
        }
        const g = c.createGain()
        const atk = Math.min((n.atk ?? 4) / 1000, (n.ms / 1000) * 0.6)
        g.gain.setValueAtTime(0.0001, t0)
        g.gain.exponentialRampToValueAtTime((n.gain ?? 0.05) * volume, t0 + atk)
        g.gain.exponentialRampToValueAtTime(0.0001, t1)
        let tail = head
        if (n.cut) {
            const f = c.createBiquadFilter()
            f.type = "lowpass"
            f.frequency.value = n.cut
            head.connect(f)
            tail = f
        }
        tail.connect(g).connect(master)
        if (n.noise) src.start(t0, Math.random() * 1.5)
        else src.start(t0)
        src.stop(t1 + 0.02)
    }
}

/* ── Ambient record: Imaj7 → vi7 → IVmaj7 → V in D, soft pads + crackle ── */
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12)
const PROGRESSION = [
    [50, 57, 61, 66, 69], // Dmaj9-ish
    [47, 54, 57, 62, 66], // Bm7
    [43, 55, 59, 62, 66], // Gmaj7
    [45, 52, 57, 61, 64], // A
]

function startAmbient() {
    const c = audio()
    if (!c || ambient) return
    const out = c.createGain()
    out.gain.setValueAtTime(0.0001, c.currentTime)
    out.gain.exponentialRampToValueAtTime(0.18, c.currentTime + 1.5)
    const warm = c.createBiquadFilter()
    warm.type = "lowpass"
    warm.frequency.value = 1800
    warm.connect(out).connect(master)

    // Vinyl crackle: sparse clicks over a quiet hiss.
    const hiss = c.createBufferSource()
    hiss.buffer = noise(c)
    hiss.loop = true
    const hissF = c.createBiquadFilter()
    hissF.type = "bandpass"
    hissF.frequency.value = 3200
    hissF.Q.value = 0.6
    const hissG = c.createGain()
    hissG.gain.value = 0.012
    hiss.connect(hissF).connect(hissG).connect(out)
    hiss.start()

    let step = 0
    let stopped = false
    const playChord = () => {
        if (stopped) return
        const now = c.currentTime
        const chord = PROGRESSION[step % PROGRESSION.length]
        chord.forEach((m, i) => {
            const o = c.createOscillator()
            o.type = i === 0 ? "sine" : "triangle"
            o.frequency.value = midi(m)
            o.detune.value = (Math.random() - 0.5) * 8
            const g = c.createGain()
            const peak = i === 0 ? 0.05 : 0.022
            g.gain.setValueAtTime(0.0001, now)
            g.gain.exponentialRampToValueAtTime(peak, now + 1.4)
            g.gain.exponentialRampToValueAtTime(0.0001, now + 7.6)
            o.connect(g).connect(warm)
            o.start(now)
            o.stop(now + 7.8)
        })
        // A gentle melody note now and then.
        if (Math.random() > 0.35) {
            const top = chord[2 + Math.floor(Math.random() * 3)] + 12
            const o = c.createOscillator()
            o.type = "sine"
            o.frequency.value = midi(top)
            const g = c.createGain()
            const t = now + 1 + Math.random() * 3
            g.gain.setValueAtTime(0.0001, t)
            g.gain.exponentialRampToValueAtTime(0.03, t + 0.05)
            g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4)
            o.connect(g).connect(warm)
            o.start(t)
            o.stop(t + 2.5)
        }
        step++
    }
    const crackle = () => {
        if (stopped) return
        const t = c.currentTime + Math.random() * 0.3
        schedule(
            c,
            [
                {
                    hz: 2000 + Math.random() * 3000,
                    ms: 4 + Math.random() * 6,
                    gain: 0.02 + Math.random() * 0.03,
                    noise: "bandpass",
                    q: 4,
                    atk: 0.5,
                },
            ],
            t,
            1,
        )
    }

    playChord()
    const chordTimer = setInterval(playChord, 6000)
    const crackleTimer = setInterval(crackle, 140)

    ambient = {
        stop() {
            stopped = true
            clearInterval(chordTimer)
            clearInterval(crackleTimer)
            const now = c.currentTime
            out.gain.cancelScheduledValues(now)
            out.gain.setValueAtTime(out.gain.value, now)
            out.gain.exponentialRampToValueAtTime(0.0001, now + 0.8)
            setTimeout(() => {
                hiss.stop()
                out.disconnect()
            }, 900)
        },
    }
}

function stopAmbient() {
    ambient?.stop()
    ambient = null
}

let lastScratch = 0
export const sound = {
    get enabled() {
        return enabled
    },
    init() {
        if (typeof window === "undefined") return
        try {
            enabled = localStorage.getItem(KEY) === "on"
        } catch {}
        // Audio can only start after a gesture; arm ambient for the first one.
        if (enabled) {
            const arm = () => {
                if (enabled && !held) startAmbient()
                window.removeEventListener("pointerdown", arm)
                window.removeEventListener("keydown", arm)
            }
            window.addEventListener("pointerdown", arm, { once: true })
            window.addEventListener("keydown", arm, { once: true })
        }
        document.addEventListener("visibilitychange", () => {
            if (!ctx) return
            if (document.hidden) ctx.suspend()
            else if (enabled) ctx.resume()
        })
        emit()
    },
    setEnabled(next) {
        enabled = next
        try {
            localStorage.setItem(KEY, next ? "on" : "off")
        } catch {}
        if (next) {
            if (!held) startAmbient()
            sound.ui("landed", { force: true })
        } else stopAmbient()
        emit()
    },
    toggle() {
        sound.setEnabled(!enabled)
    },
    /** Step the ambient record aside while something else plays (it stays "on"). */
    pauseAmbient() {
        held = true
        stopAmbient()
    },
    /** …and bring it back afterwards, if it is still on. */
    resumeAmbient() {
        if (!held) return
        held = false
        if (enabled) startAmbient()
    },
    ui(name, { volume = 1, force = false } = {}) {
        if (!enabled && !force) return
        const c = audio()
        if (!c || !UI[name]) return
        schedule(c, UI[name], c.currentTime + 0.005, volume)
    },
    /** A short burst of filtered noise whose pitch follows the hand speed. */
    scratch(velocity) {
        if (!enabled) return
        const c = audio()
        if (!c) return
        const nowMs = performance.now()
        if (nowMs - lastScratch < 45) return
        lastScratch = nowMs
        const v = Math.min(Math.abs(velocity), 6)
        if (v < 0.25) return
        const hz = 300 + v * 380
        schedule(
            c,
            [
                {
                    hz,
                    ms: 60,
                    gain: 0.05 + v * 0.012,
                    noise: "bandpass",
                    q: 2.5,
                    atk: 4,
                },
                {
                    hz: hz * 0.5,
                    to: hz * (velocity > 0 ? 0.7 : 0.35),
                    ms: 70,
                    gain: 0.03,
                    wave: "sawtooth",
                    cut: 1400,
                    atk: 4,
                },
            ],
            c.currentTime + 0.002,
        )
    },
    subscribe(fn) {
        listeners.add(fn)
        return () => listeners.delete(fn)
    },
}

export function useSound() {
    const on = useSyncExternalStore(
        sound.subscribe,
        () => enabled,
        () => false,
    )
    return { enabled: on, toggle: sound.toggle, setEnabled: sound.setEnabled }
}
