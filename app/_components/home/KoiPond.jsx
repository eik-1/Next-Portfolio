"use client"

import { useEffect, useRef } from "react"

import { angleTo, bayer, hash, noise } from "@/app/_lib/pixel"
import { useReducedMotion } from "@/app/_lib/useReducedMotion"

/*
 * A koi pond behind the hero, drawn in code on a pixel grid: fine pixel
 * strokes in grey ink, forms that fade through dither as they sink, faint
 * dotted ripples. The page paper is the water. One koi is a kohaku with red
 * patches, the only red in the hero.
 */
const CELL = 3 // css px per grid cell
const STEP_MS = 50 // 20 steps a second, drawn as frames
const BELOW = 80 // the pond runs this far past the hero's bottom edge
const PAD = 8 // cells of clear water kept around the text and the photo

// A koi's width along its body (0 = nose, 1 = tail root): a blunt round
// head, widest a third back, a narrow tail root.
const WIDTH = [
    [0, 0.72],
    [0.08, 0.9],
    [0.25, 1],
    [0.5, 0.86],
    [0.75, 0.56],
    [1, 0.32],
]
const widthAt = (t) => {
    for (let i = 1; i < WIDTH.length; i++) {
        const [t1, w1] = WIDTH[i]
        if (t <= t1) {
            const [t0, w0] = WIDTH[i - 1]
            return w0 + ((w1 - w0) * (t - t0)) / (t1 - t0)
        }
    }
    return 0.2
}

// Pattern patches in body space: u along (0..1), v across (-1..1).
const PATTERNS = {
    kohaku: [
        { u: 0.08, v: 0, ru: 0.09, rv: 0.75, red: true },
        { u: 0.36, v: -0.15, ru: 0.15, rv: 0.95, red: true },
        { u: 0.66, v: 0.2, ru: 0.1, rv: 0.8, red: true },
    ],
    karasu: [{ u: 0.5, v: 0, ru: 0.6, rv: 1.4 }],
    showa: [
        { u: 0.14, v: 0.3, ru: 0.08, rv: 0.6 },
        { u: 0.38, v: -0.4, ru: 0.12, rv: 0.7 },
        { u: 0.55, v: 0.5, ru: 0.08, rv: 0.55 },
        { u: 0.74, v: -0.2, ru: 0.08, rv: 0.6 },
    ],
    utsuri: [
        { u: 0.25, v: 0.45, ru: 0.12, rv: 0.6 },
        { u: 0.6, v: -0.4, ru: 0.14, rv: 0.7 },
    ],
    ghost: [],
}
const KINDS = ["kohaku", "showa", "karasu", "utsuri", "ghost"]
const SPINE = 12

/**
 * Koi swim in the open water around the hero's text and photo (they treat
 * both as islands), wander, keep apart, and come up now and then. Move the
 * pointer and the water ripples; a slow pointer makes a koi curious, a fast
 * one makes it dart. Tap open water to drop food.
 */
export default function KoiPond() {
    const reduced = useReducedMotion()
    const canvas = useRef(null)

    useEffect(() => {
        const el = canvas.current
        const section = el.parentElement
        const ctx = el.getContext("2d")
        const colors = {}
        let cols = 0
        let rows = 0
        let cell = CELL
        let step = 0
        let raf = 0
        let last = 0
        let seen = false
        let obstacles = []
        let pad = PAD
        let fish = []
        let pads = []
        const ripples = []
        const food = []
        const pointer = { x: -1e3, y: -1e3, speed: 0, t: 0, ripple: 0 }

        const readColors = () => {
            const s = getComputedStyle(document.documentElement)
            for (const k of ["ink", "soft", "faint", "line-2", "red"])
                colors[k] = s.getPropertyValue(`--${k}`).trim()
        }

        const px = (c, r) => {
            const x = Math.round(c * cell)
            const y = Math.round(r * cell)
            ctx.fillRect(
                x,
                y,
                Math.round((c + 1) * cell) - x,
                Math.round((r + 1) * cell) - y,
            )
        }

        // ---- layout ---------------------------------------------------
        const inObstacle = (x, y, m = 0) =>
            obstacles.some(
                (o) =>
                    x > o.x0 - m &&
                    x < o.x1 + m &&
                    y > o.y0 - m &&
                    y < o.y1 + m,
            )

        const openSpot = (margin) => {
            for (let n = 0; n < 200; n++) {
                const x = margin + Math.random() * (cols - margin * 2)
                const y = margin + Math.random() * (rows - margin * 2)
                if (!inObstacle(x, y, margin)) return { x, y }
            }
            return { x: Math.random() * cols, y: rows - margin }
        }

        const makeFish = (i, narrow) => {
            const kind = KINDS[i % KINDS.length]
            const len = narrow
                ? 16 + Math.random() * 6
                : 28 + Math.random() * 14
            const at = openSpot(6)
            const a = Math.random() * Math.PI * 2
            const seg = len / (SPINE - 1)
            return {
                kind,
                len,
                seg,
                x: at.x,
                y: at.y,
                a,
                speed: 0.3,
                phase: Math.random() * 10,
                depth: Math.random() * 0.6,
                seed: i * 17.3 + 4,
                dart: 0,
                avoid: 0,
                side: 1,
                spine: Array.from({ length: SPINE }, (_, k) => ({
                    x: at.x - Math.cos(a) * seg * k,
                    y: at.y - Math.sin(a) * seg * k,
                })),
            }
        }

        let lastW = 0
        let lastH = 0
        const layout = () => {
            const sr = section.getBoundingClientRect()
            const W = document.documentElement.clientWidth
            const H = section.offsetHeight + BELOW
            // Phones fire `resize` while scrolling (the address bar comes and
            // goes) without the pond changing size: keep everything as it is.
            if (W === lastW && H === lastH) return false
            const widthChanged = W !== lastW
            lastW = W
            lastH = H
            el.style.left = `${-sr.left}px`
            el.style.width = `${W}px`
            el.style.height = `${H}px`
            const dpr = Math.min(2, window.devicePixelRatio || 1) // crisp enough; caps the bitmap
            el.width = Math.round(W * dpr)
            el.height = Math.round(H * dpr)
            cell = CELL * dpr
            const fresh = cols === 0
            cols = Math.ceil(W / CELL)
            rows = Math.ceil(H / CELL)

            const narrow = W < 640
            pad = narrow ? 5 : PAD // phones have little open water: hug the islands closer
            const cr = el.getBoundingClientRect()
            obstacles = [...section.querySelectorAll("[data-pond-avoid]")].map(
                (n) => {
                    const r = n.getBoundingClientRect()
                    return {
                        x0: (r.left - cr.left) / CELL - pad,
                        y0: (r.top - cr.top) / CELL - pad,
                        x1: (r.right - cr.left) / CELL + pad,
                        y1: (r.bottom - cr.top) / CELL + pad,
                    }
                },
            )

            if (fresh || fish.length !== (narrow ? 3 : 5))
                fish = Array.from({ length: narrow ? 3 : 5 }, (_, i) =>
                    makeFish(i, narrow),
                )
            // Lily pads stay put unless the width changed or one now sits on an island.
            const stranded = pads.some((p) => inObstacle(p.x, p.y, p.r))
            if (!widthChanged && !stranded && pads.length) return true
            pads = []
            for (let n = 0; n < (narrow ? 2 : 4); n++) {
                const r = narrow ? 5 + Math.random() * 2 : 9 + Math.random() * 5
                for (let tries = 0; tries < 60; tries++) {
                    const p = openSpot(r + 2)
                    if (
                        pads.every(
                            (q) =>
                                Math.hypot(q.x - p.x, q.y - p.y) > q.r + r + 6,
                        )
                    ) {
                        pads.push({
                            ...p,
                            r,
                            notch: Math.random() * Math.PI * 2,
                            spin: (Math.random() - 0.5) * 0.004,
                        })
                        break
                    }
                }
            }
            return true
        }

        // ---- behaviour ------------------------------------------------
        const steer = (f) => {
            let dx = Math.cos(f.a)
            let dy = Math.sin(f.a)
            // wander
            const w = (noise(step * 0.02 + f.seed, f.seed) - 0.5) * 2
            dx += Math.cos(f.a + w * 0.8) * 0.6
            dy += Math.sin(f.a + w * 0.8) * 0.6

            // walls: drift back in from beyond the edges. A koi that is fully
            // out swims straight back in, ignoring the islands until it is.
            const m = f.len * 0.4
            const out = f.x < -m ? 1 : f.x > cols + m ? -1 : 0
            if (out) {
                dx += out * 4
                const band = obstacles.find((o) => f.y > o.y0 && f.y < o.y1)
                if (band) dy += f.y - band.y0 < band.y1 - f.y ? -2 : 2
            }
            const mv = f.len * 0.6
            if (f.y < mv) dy += 1.5 + (mv - f.y) * 0.3
            if (f.y > rows - mv) dy -= 1.5 + (f.y - rows + mv) * 0.3

            // islands: a koi keeps its body clear of them, and when the water
            // ahead runs into one it picks a side and commits to the turn
            // (re-deciding every step would leave it circling in a channel)
            for (const o of out ? [] : obstacles) {
                const nx = Math.max(o.x0, Math.min(f.x, o.x1))
                const ny = Math.max(o.y0, Math.min(f.y, o.y1))
                let ox = f.x - nx
                let oy = f.y - ny
                let d = Math.hypot(ox, oy)
                if (d === 0) {
                    // inside: out through the nearest side
                    const sides = [
                        [f.x - o.x0, -1, 0],
                        [o.x1 - f.x, 1, 0],
                        [f.y - o.y0, 0, -1],
                        [o.y1 - f.y, 0, 1],
                    ].sort((p, q) => p[0] - q[0])
                    ox = sides[0][1]
                    oy = sides[0][2]
                    d = 0.5
                }
                if (d < 6) {
                    dx += (ox / d) * (6 - d) * 0.6
                    dy += (oy / d) * (6 - d) * 0.6
                }
            }
            if (f.avoid > 0) f.avoid--
            else if (!out) {
                let hit = null
                for (const k of [0.6, 1.2]) {
                    const lx = f.x + Math.cos(f.a) * f.len * k
                    const ly = f.y + Math.sin(f.a) * f.len * k
                    hit ||= obstacles.find(
                        (o) => lx > o.x0 && lx < o.x1 && ly > o.y0 && ly < o.y1,
                    )
                }
                if (hit) {
                    // turn away from the island's centre
                    const cx = (hit.x0 + hit.x1) / 2 - f.x
                    const cy = (hit.y0 + hit.y1) / 2 - f.y
                    f.side =
                        Math.cos(f.a) * cy - Math.sin(f.a) * cx > 0 ? -1 : 1
                    f.avoid = 26
                }
            }
            if (f.avoid > 0) {
                dx += Math.cos(f.a + f.side * 1.4) * 3
                dy += Math.sin(f.a + f.side * 1.4) * 3
            }

            // keep apart
            for (const g of fish) {
                if (g === f) continue
                const ox = f.x - g.x
                const oy = f.y - g.y
                const d = Math.hypot(ox, oy)
                const near = (f.len + g.len) * 0.45
                if (d > 0 && d < near) {
                    dx += (ox / d) * (near - d) * 0.08
                    dy += (oy / d) * (near - d) * 0.08
                }
            }

            // food: swim to the nearest pellet
            let hungry = false
            let best = null
            let bestD = 220 // koi notice food from far off
            for (const p of food) {
                const d = Math.hypot(p.x - f.x, p.y - f.y)
                if (d < bestD) {
                    best = p
                    bestD = d
                }
            }
            if (best && bestD < 2.2) {
                // close enough: eat it
                food.splice(food.indexOf(best), 1)
                ripples.push({ x: best.x, y: best.y, r: 1, max: 8, rings: 1 })
            } else if (best) {
                hungry = true
                dx += ((best.x - f.x) / bestD) * 2.2
                dy += ((best.y - f.y) / bestD) * 2.2
            }

            // the pointer: slow and close → curious; fast and close → dart away
            const pd = Math.hypot(pointer.x - f.x, pointer.y - f.y)
            if (pd < 28 && step - pointer.t < 10) {
                if (pointer.speed > 900 && !f.dart) {
                    f.dart = 14
                    f.a = Math.atan2(f.y - pointer.y, f.x - pointer.x)
                } else if (pointer.speed < 260 && pd > 9 && !hungry) {
                    dx += ((pointer.x - f.x) / pd) * 0.9
                    dy += ((pointer.y - f.y) / pd) * 0.9
                }
            }

            // gentle turns: a koi swings wide rather than coiling
            const turn = f.dart ? 0.15 : f.avoid || hungry ? 0.07 : 0.035
            const delta = angleTo(f.a, Math.atan2(dy, dx))
            f.a += Math.max(-turn, Math.min(turn, delta))
            const cruise = 0.3 + 0.12 * noise(step * 0.015, f.seed + 3)
            const want = f.dart ? 1.1 : hungry ? 0.95 : cruise
            f.speed += (want - f.speed) * 0.15
            if (f.dart) f.dart--
        }

        const move = (f) => {
            steer(f)
            f.x += Math.cos(f.a) * f.speed
            f.y += Math.sin(f.a) * f.speed
            f.y = Math.max(f.len * 0.2, Math.min(rows - f.len * 0.2, f.y))
            f.phase += 0.18 + f.speed * 0.9
            f.spine[0].x = f.x
            f.spine[0].y = f.y
            for (let i = 1; i < SPINE; i++) {
                const p = f.spine[i - 1]
                const q = f.spine[i]
                const d = Math.hypot(q.x - p.x, q.y - p.y) || 1
                q.x = p.x + ((q.x - p.x) / d) * f.seg
                q.y = p.y + ((q.y - p.y) / d) * f.seg
            }
            // sink and rise slowly; now and then come up and ring the surface
            const want = noise(step * 0.004, f.seed + 9) * 0.75
            f.depth += (want - f.depth) * 0.02
            if (f.depth < 0.12 && Math.random() < 0.004)
                ripples.push({ x: f.x, y: f.y, r: 1, max: 10, rings: 1 })
        }

        // ---- drawing --------------------------------------------------
        // The body is drawn from a spine that bends with a travelling wave.
        const bodyOf = (f) => {
            const amp = f.len * 0.045
            return f.spine.map((p, i) => {
                const q = f.spine[Math.max(0, i - 1)]
                const r = f.spine[Math.min(SPINE - 1, i + 1)]
                const tx = q.x - r.x
                const ty = q.y - r.y
                const tl = Math.hypot(tx, ty) || 1
                const s =
                    Math.sin(f.phase - i * 0.55) *
                    amp *
                    Math.pow(i / (SPINE - 1), 1.3)
                return { x: p.x + (-ty / tl) * s, y: p.y + (tx / tl) * s }
            })
        }

        const patchAt = (f, u, v) => {
            for (const p of PATTERNS[f.kind]) {
                const e =
                    ((u - p.u) / p.ru) ** 2 +
                    ((v - p.v) / p.rv) ** 2 -
                    0.35 * (noise(u * 9 + f.seed, v * 3 + p.u * 7) - 0.5)
                if (e < 1) return p.red ? "red" : "ink"
            }
            return null
        }

        const drawFish = (f, ink) => {
            const pts = bodyOf(f)
            const W = f.len * 0.15
            const dense = ink * (1 - f.depth * 0.6) // deeper → sparser
            const show = (c, r, d = 1) => bayer(c, r) < dense * d

            // fins first, body over them
            const fins = []
            const tail = pts[SPINE - 1]
            const pre = pts[SPINE - 2]
            const back = Math.atan2(tail.y - pre.y, tail.x - pre.x)
            fins.push({
                x: tail.x,
                y: tail.y,
                a: back + Math.sin(f.phase * 0.9) * 0.35,
                len: f.len * 0.26,
                spread: 0.55,
                fork: true,
            })
            const head = pts[0]
            const neck = pts[2]
            const ha = Math.atan2(head.y - neck.y, head.x - neck.x)
            const flap = Math.sin(f.phase * 0.6) * 0.25
            for (const side of [-1, 1]) {
                const base = pts[2]
                fins.push({
                    x: base.x + Math.cos(ha + (side * Math.PI) / 2) * W * 0.9,
                    y: base.y + Math.sin(ha + (side * Math.PI) / 2) * W * 0.9,
                    a: ha + side * (2.2 + flap),
                    len: f.len * 0.16,
                    spread: 0.4,
                })
                const hip = pts[6]
                fins.push({
                    x: hip.x + Math.cos(ha + (side * Math.PI) / 2) * W * 0.5,
                    y: hip.y + Math.sin(ha + (side * Math.PI) / 2) * W * 0.5,
                    a: ha + side * 2.6,
                    len: f.len * 0.09,
                    spread: 0.35,
                })
            }
            ctx.fillStyle = colors.faint
            for (const fin of fins) {
                const R = Math.ceil(fin.len) + 1
                for (let r = Math.floor(fin.y - R); r <= fin.y + R; r++)
                    for (let c = Math.floor(fin.x - R); c <= fin.x + R; c++) {
                        const ox = c + 0.5 - fin.x
                        const oy = r + 0.5 - fin.y
                        const d = Math.hypot(ox, oy)
                        if (d > fin.len || d < 0.5) continue
                        const off = Math.abs(angleTo(fin.a, Math.atan2(oy, ox)))
                        const t = d / fin.len
                        const reach = fin.spread * Math.sqrt(t)
                        if (fin.fork && off * d < 1.2 && t > 0.72) continue // the notch in a koi's tail
                        if (off > reach) continue
                        const edge = (reach - off) * d < 1.1 || t > 0.92
                        if (show(c, r, edge ? 0.9 : 0.45 * (1 - t * 0.6)))
                            px(c, r)
                    }
            }

            // body: nearest point on the spine gives position along (u) and across (v)
            let x0 = Infinity
            let y0 = Infinity
            let x1 = -Infinity
            let y1 = -Infinity
            for (const p of pts) {
                x0 = Math.min(x0, p.x)
                y0 = Math.min(y0, p.y)
                x1 = Math.max(x1, p.x)
                y1 = Math.max(y1, p.y)
            }
            const m = W + 1
            // the spine's segments, worked out once per fish per frame
            const segs = []
            for (let i = 0; i < SPINE - 1; i++) {
                const ex = pts[i + 1].x - pts[i].x
                const ey = pts[i + 1].y - pts[i].y
                segs.push({
                    ax: pts[i].x,
                    ay: pts[i].y,
                    ex,
                    ey,
                    l2: ex * ex + ey * ey || 1,
                })
            }
            for (let r = Math.floor(y0 - m); r <= y1 + m; r++)
                for (let c = Math.floor(x0 - m); c <= x1 + m; c++) {
                    const cx = c + 0.5
                    const cy = r + 0.5
                    let best = Infinity
                    let u = 0
                    let side = 0
                    for (let i = 0; i < SPINE - 1; i++) {
                        const { ax, ay, ex, ey, l2 } = segs[i]
                        const t = Math.max(
                            0,
                            Math.min(1, ((cx - ax) * ex + (cy - ay) * ey) / l2),
                        )
                        const qx = ax + ex * t - cx
                        const qy = ay + ey * t - cy
                        const d = qx * qx + qy * qy
                        if (d < best) {
                            best = d
                            u = (i + t) / (SPINE - 1)
                            side = ex * (cy - ay) - ey * (cx - ax) > 0 ? 1 : -1
                        }
                    }
                    const w = W * widthAt(u)
                    const d = Math.sqrt(best)
                    if (d > w) continue // past the nose this is a round cap
                    const v = (side * d) / w
                    if (d > w - 1) {
                        if (show(c, r, 1.6)) {
                            ctx.fillStyle = colors.soft
                            px(c, r)
                        }
                        continue
                    }
                    // eyes, set wide on the head
                    if (
                        u > 0.04 &&
                        u < 0.1 &&
                        Math.abs(Math.abs(v) - 0.62) < 0.2
                    ) {
                        if (show(c, r)) {
                            ctx.fillStyle = colors.ink
                            px(c, r)
                        }
                        continue
                    }
                    const patch = patchAt(f, u, v)
                    if (patch) {
                        if (show(c, r)) {
                            ctx.fillStyle = colors[patch]
                            px(c, r)
                        }
                    } else if (show(c, r, 0.3)) {
                        ctx.fillStyle = colors["line-2"]
                        px(c, r) // the pale body: a light sprinkle
                    }
                }
        }

        const drawPad = (p, ink) => {
            const R = Math.ceil(p.r) + 1
            for (let r = Math.floor(p.y - R); r <= p.y + R; r++)
                for (let c = Math.floor(p.x - R); c <= p.x + R; c++) {
                    const ox = c + 0.5 - p.x
                    const oy = r + 0.5 - p.y
                    const d = Math.hypot(ox, oy)
                    if (d > p.r) continue
                    const a = Math.atan2(oy, ox)
                    const off = Math.abs(angleTo(p.notch, a))
                    if (off < 0.2 && d > 1) continue // the notch
                    const rim = d > p.r - 1 || (off < 0.3 && d > 1)
                    if (rim) {
                        if (bayer(c, r) < ink) {
                            ctx.fillStyle = colors.soft
                            px(c, r)
                        }
                    } else if (bayer(c, r) < ink * 0.22) {
                        ctx.fillStyle = colors["line-2"]
                        px(c, r)
                    } else {
                        ctx.clearRect(
                            Math.round(c * cell),
                            Math.round(r * cell),
                            Math.ceil(cell),
                            Math.ceil(cell),
                        )
                    }
                }
        }

        const drawRipples = (ink) => {
            ctx.fillStyle = colors.faint
            for (const w of ripples)
                for (let k = 0; k < w.rings; k++) {
                    const rad = w.r - k * 3
                    if (rad <= 0.5) continue
                    const dense = ink * 0.75 * (1 - rad / w.max)
                    const n = Math.ceil((Math.PI * 2 * rad) / 2) // a dot every other cell
                    for (let j = 0; j < n; j++) {
                        const a = (j / n) * Math.PI * 2
                        const c = Math.round(w.x + Math.cos(a) * rad)
                        const r = Math.round(w.y + Math.sin(a) * rad * 0.8)
                        if (hash(j, w.x + w.y) < dense) px(c, r)
                    }
                }
        }

        const draw = () => {
            ctx.clearRect(0, 0, el.width, el.height)
            // the pond inks in over the first second or so, in steps
            const ink = reduced
                ? 1
                : Math.min(1, Math.floor((step / 24) * 5) / 5)
            if (!ink) return
            ;[...fish]
                .sort((a, b) => b.depth - a.depth)
                .forEach((f) => drawFish(f, ink))
            ctx.fillStyle = colors.ink
            for (const p of food)
                if (p.life > 30 || step % 2)
                    px(Math.round(p.x), Math.round(p.y))
            for (const p of pads) drawPad(p, ink)
            drawRipples(ink)
        }

        const tick = () => {
            step++
            for (const f of fish) move(f)
            for (const p of pads) p.notch += p.spin
            for (let n = ripples.length - 1; n >= 0; n--) {
                const w = ripples[n]
                w.r += 0.55
                if (w.r - (w.rings - 1) * 3 > w.max) ripples.splice(n, 1)
            }
            for (let n = food.length - 1; n >= 0; n--) {
                const p = food[n]
                p.x += Math.sin(step * 0.1 + n) * 0.03
                if (--p.life <= 0) food.splice(n, 1)
            }
            draw()
        }

        const loop = (t) => {
            raf = requestAnimationFrame(loop)
            if (t - last < STEP_MS) return
            last = t
            tick()
        }
        const run = () => {
            cancelAnimationFrame(raf)
            if (!reduced && seen && !document.hidden)
                raf = requestAnimationFrame(loop)
        }

        // ---- pointer ----------------------------------------------------
        const local = (e) => {
            const r = el.getBoundingClientRect()
            return {
                x: (e.clientX - r.left) / CELL,
                y: (e.clientY - r.top) / CELL,
                inside:
                    e.clientX >= r.left &&
                    e.clientX <= r.right &&
                    e.clientY >= r.top &&
                    e.clientY <= r.bottom,
            }
        }
        const onMove = (e) => {
            const p = local(e)
            if (!p.inside) return
            const now = performance.now()
            const dt = Math.max(16, now - (pointer.at || 0))
            const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y) * CELL
            pointer.speed = dist > 400 ? 0 : (dist / dt) * 1000
            pointer.x = p.x
            pointer.y = p.y
            pointer.at = now
            pointer.t = step
            if (
                !reduced &&
                now - pointer.ripple > 350 &&
                !inObstacle(p.x, p.y, -pad + 2)
            ) {
                pointer.ripple = now
                ripples.push({ x: p.x, y: p.y, r: 1, max: 9, rings: 1 })
            }
        }
        // A finished primary click or tap: never a scroll swipe or a right-click.
        // Taps are read from pointerdown/up rather than `click`, because iOS
        // Safari never sends a click for a tap on plain, non-clickable page.
        const press = { id: null, x: 0, y: 0, at: 0 }
        const onDown = (e) => {
            if (!e.isPrimary || e.button !== 0) return
            press.id = e.pointerId
            press.x = e.clientX
            press.y = e.clientY
            press.at = performance.now()
        }
        const onCancel = (e) => {
            if (e.pointerId === press.id) press.id = null
        }
        const onUp = (e) => {
            if (e.pointerId !== press.id) return
            press.id = null
            const moved = Math.hypot(e.clientX - press.x, e.clientY - press.y)
            if (moved > 10 || performance.now() - press.at > 600) return
            onTap(e)
        }
        const onTap = (e) => {
            if (reduced) return
            const p = local(e)
            if (!p.inside || inObstacle(p.x, p.y, -pad + 2)) return
            if (
                e.target.closest?.(
                    "a, button, input, textarea, nav, header, [role='dialog'], [data-pond-avoid]",
                )
            )
                return
            ripples.push({ x: p.x, y: p.y, r: 1, max: 14, rings: 2 })
            const n = 2 + Math.floor(Math.random() * 2)
            for (let k = 0; k < n; k++)
                food.push({
                    x: p.x + (Math.random() - 0.5) * 5,
                    y: p.y + (Math.random() - 0.5) * 4,
                    life: 220,
                })
        }

        readColors()
        layout()
        if (reduced) {
            for (let n = 0; n < 40; n++) for (const f of fish) move(f) // let them settle into poses
            ripples.push({ ...openSpot(12), r: 6, max: 14, rings: 2 })
        }
        draw()

        const ro = new ResizeObserver(() => layout() && draw())
        ro.observe(section)
        // the viewport can change without the hero changing (it stops at 1040px)
        const onResize = () => layout() && draw()
        window.addEventListener("resize", onResize)
        const io = new IntersectionObserver(([e]) => {
            seen = e.isIntersecting
            run()
        })
        io.observe(el)
        const mo = new MutationObserver(() => {
            readColors()
            draw()
        })
        mo.observe(document.documentElement, { attributes: true })
        document.addEventListener("visibilitychange", run)
        window.addEventListener("pointermove", onMove, { passive: true })
        window.addEventListener("pointerdown", onDown, { passive: true })
        window.addEventListener("pointerup", onUp, { passive: true })
        window.addEventListener("pointercancel", onCancel, { passive: true })

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            io.disconnect()
            mo.disconnect()
            document.removeEventListener("visibilitychange", run)
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerdown", onDown)
            window.removeEventListener("pointerup", onUp)
            window.removeEventListener("pointercancel", onCancel)
            window.removeEventListener("resize", onResize)
        }
    }, [reduced])

    return (
        <canvas
            ref={canvas}
            aria-hidden
            className="pointer-events-none absolute top-0 -z-10"
        />
    )
}
