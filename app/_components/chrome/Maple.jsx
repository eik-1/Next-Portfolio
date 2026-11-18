"use client"

import { useEffect, useRef } from "react"

import { bayer, hash, noise, seeded } from "@/app/_lib/pixel"
import { useReducedMotion } from "@/app/_lib/useReducedMotion"

/*
 * The footer's sign-off, drawn in code like the hero's koi pond: a Japanese
 * maple grown by a seeded branching rule on a bank by still water. Fine
 * pixel strokes in grey ink that fade through dither toward the twig ends;
 * the page paper is the water. Its red leaves are the only red here.
 */
const CELL = 3 // css px per grid cell, same as the pond
const STEP_MS = 50 // 20 steps a second
const SEED = 7 // the tree's shape; change it for another tree
const WATER = 16 // rows of water under the waterline (the reflection lives here)
const MAX_DEPTH = 6

// a pixel maple leaf, and the narrower frames it shows as it turns in the air
const LEAF = [
    ["..#..", "#.#.#", "#####", ".###.", "..#.."],
    [".#.", "###", "###", ".#."],
    ["#", "#", "#"],
]
const FLOAT = ["#.#.#", "#####"] // lying flat on the water

// grid codes → tokens
const TONE = ["", "--soft", "--faint", "--line-2", "--red"]
const SOFT = 1
const FAINT = 2
const PALE = 3
const RED = 4

/** Grow the tree: segments with a depth, a growth start and a width. */
const growTree = (cols, rows, size) => {
    const rnd = seeded(SEED)
    const wy = rows - WATER
    const scale = ((wy - 4) / 72) * size
    const segs = []
    const tips = []
    const grow = (x, y, a, len, w, depth, start) => {
        const x1 = x + Math.cos(a) * len
        const y1 = y + Math.sin(a) * len
        segs.push({
            x0: x,
            y0: y,
            x1,
            y1,
            w0: w,
            w1: w * 0.72,
            d0: depth,
            d1: depth + 1,
            start,
        })
        const end = start + 3 + len * 0.25
        if (depth >= MAX_DEPTH || len < 2.2) {
            tips.push({
                x: x1,
                y: y1,
                depth: depth + 1,
                start: end,
                r: 1.8 + rnd() * 1.8,
                seed: rnd() * 100,
                leaf: rnd() < 0.4,
                red: rnd() < 0.1,
            })
            return
        }
        const n = depth < 2 || rnd() < 0.62 ? 2 : 3
        const spread = 0.68 + depth * 0.04
        for (let i = 0; i < n; i++) {
            let b =
                a +
                spread * (i - (n - 1) / 2) * (1.6 + rnd() * 0.5) +
                (rnd() - 0.5) * 0.3
            // a maple's crown spreads into a wide dome: higher branches lean outward
            const out = b < -Math.PI / 2 ? -Math.PI * 0.95 : -Math.PI * 0.05
            b += (out - b) * Math.min(0.58, 0.1 + depth * 0.1)
            grow(
                x1,
                y1,
                b,
                len * (0.74 + rnd() * 0.12),
                Math.max(0.6, w * 0.7),
                depth + 1,
                end,
            )
        }
    }
    // the trunk: three bends leaning gently, then the crown
    let x = cols * (cols < 200 ? 0.24 : 0.17)
    let y = wy - 2
    let a = -Math.PI / 2 - 0.12
    let start = 0
    for (let k = 0; k < 3; k++) {
        const len = 6 * scale
        const nx = x + Math.cos(a) * len
        const ny = y + Math.sin(a) * len
        segs.push({
            x0: x,
            y0: y,
            x1: nx,
            y1: ny,
            w0: 4.6 - k * 0.5,
            w1: 4.1 - k * 0.5,
            d0: k / 3,
            d1: (k + 1) / 3,
            start,
        })
        x = nx
        y = ny
        start += 3
        a += k === 1 ? 0.28 : -0.18 // a soft S
    }
    grow(x, y, a - 0.1, 15 * scale, 3, 1, start)
    return {
        segs,
        tips,
        base: { x: cols * (cols < 200 ? 0.24 : 0.17), y: wy - 2 },
    }
}

/**
 * The maple grows itself the first time the footer comes into view (about
 * two seconds), then sways a little in a slow wind. Every few seconds a red
 * leaf lets go, turns over as it falls, lands on the water with a ring and
 * drifts off. The tree and its leaves show faintly in the water below.
 * Hover or tap the crown to shake a leaf loose; tap the water to ring it.
 */
export default function Maple({ className }) {
    const reduced = useReducedMotion()
    const wrap = useRef(null)
    const canvas = useRef(null)

    useEffect(() => {
        const el = canvas.current
        const box = wrap.current
        const ctx = el.getContext("2d")
        const colors = []
        let cols = 0
        let rows = 0
        let wy = 0
        let cell = CELL
        let grid = new Uint8Array(0)
        let tree = null
        let crown = { x0: 0, y0: 0, x1: 0, y1: 0 }
        let step = 0
        let grown = reduced ? 1e6 : 0 // steps since the tree started growing
        let raf = 0
        let last = 0
        let seen = false
        let shake = 0
        let nextLeaf = 60
        let lastShake = 0
        const leaves = []
        const ripples = []

        const readColors = () => {
            const s = getComputedStyle(document.documentElement)
            TONE.forEach(
                (t, i) => (colors[i] = t ? s.getPropertyValue(t).trim() : ""),
            )
        }

        const layout = () => {
            const r = box.getBoundingClientRect()
            const dpr = Math.min(2, window.devicePixelRatio || 1)
            el.width = Math.round(r.width * dpr)
            el.height = Math.round(r.height * dpr)
            cell = CELL * dpr
            cols = Math.ceil(r.width / CELL)
            rows = Math.ceil(r.height / CELL)
            wy = rows - WATER
            grid = new Uint8Array(cols * rows)
            // as big as fits: shrink until the whole crown is inside the frame
            // (clear of the top, and no wider than the left half), then slide
            // it right if it pokes past the left edge
            const extent = (t) => {
                const xs = t.tips.flatMap((p) => [p.x - p.r - 3, p.x + p.r + 3])
                for (const g of t.segs) xs.push(g.x0 - g.w0, g.x1)
                return {
                    x0: Math.min(...xs),
                    x1: Math.max(...xs),
                    y0: Math.min(...t.tips.map((p) => p.y - p.r)),
                }
            }
            for (let size = 1.35; size > 0.3; size *= 0.92) {
                tree = growTree(cols, rows, size)
                const e = extent(tree)
                if (e.y0 > 3 && e.x1 - e.x0 < cols * 0.5) break
            }
            const shift = Math.max(0, 2 - extent(tree).x0)
            for (const g of tree.segs) {
                g.x0 += shift
                g.x1 += shift
            }
            for (const t of tree.tips) t.x += shift
            tree.base.x += shift
            crown = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }
            for (const t of tree.tips) {
                crown.x0 = Math.min(crown.x0, t.x - t.r)
                crown.y0 = Math.min(crown.y0, t.y - t.r)
                crown.x1 = Math.max(crown.x1, t.x + t.r)
                crown.y1 = Math.max(crown.y1, t.y + t.r)
            }
        }

        // ---- the scene, rasterised into the grid each frame -------------
        const put = (c, r, tone) => {
            c = Math.round(c)
            r = Math.round(r)
            if (c < 0 || r < 0 || c >= cols || r >= wy) return
            grid[r * cols + c] = tone
        }

        const sway = (depth) => {
            const wind =
                0.55 * Math.sin(step * 0.031) + 0.3 * Math.sin(step * 0.073 + 1)
            const kick = shake * Math.sin(step * 0.7)
            return (wind + kick) * 2 * Math.pow(depth / (MAX_DEPTH + 1), 1.6)
        }

        const drawTree = () => {
            for (const s of tree.segs) {
                const p = Math.min(1, (grown - s.start) / 4) // grows out over 4 steps
                if (p <= 0) continue
                const x0 = s.x0 + sway(s.d0)
                const x1 = s.x1 + sway(s.d1)
                const ex = x0 + (x1 - x0) * p
                const ey = s.y0 + (s.y1 - s.y0) * p
                const len = Math.hypot(ex - x0, ey - s.y0)
                const n = Math.max(1, Math.ceil(len * 2))
                // twigs fade toward their ends, like the pond's sinking koi
                const fade = s.d1 > 4 ? 1 - (s.d1 - 4) * 0.17 : 1
                for (let i = 0; i <= n; i++) {
                    const t = i / n
                    const x = x0 + (ex - x0) * t
                    const y = s.y0 + (ey - s.y0) * t
                    const w = s.w0 + (s.w1 - s.w0) * t * p
                    const r = w / 2
                    if (r < 0.75) {
                        const c = Math.round(x)
                        const rr = Math.round(y)
                        if (bayer(c, rr) < fade)
                            put(c, rr, s.d1 > 5 ? FAINT : SOFT)
                        continue
                    }
                    // thick wood: a solid outline with a sparse dithered inside
                    for (let rr = Math.floor(y - r); rr <= y + r; rr++)
                        for (let c = Math.floor(x - r); c <= x + r; c++) {
                            const d = Math.hypot(c + 0.5 - x, rr + 0.5 - y)
                            if (d > r) continue
                            if (d > r - 1 || bayer(c, rr) < 0.3)
                                put(c, rr, SOFT)
                        }
                }
            }
            // the crown: dithered clouds of leaves, with a few drawn leaves in them
            for (const t of tree.tips) {
                const k = Math.max(0, Math.min(1, (grown - t.start) / 8))
                if (!k) continue
                const x = t.x + sway(t.depth)
                const R = t.r
                for (let r = Math.floor(t.y - R); r <= t.y + R; r++)
                    for (let c = Math.floor(x - R); c <= x + R; c++) {
                        const d = Math.hypot(c + 0.5 - x, r + 0.5 - t.y) / R
                        if (d > 1) continue
                        if (hash(c * 0.37 + t.seed, r) < k * 0.42 * (1 - d * d))
                            put(c, r, PALE)
                    }
                if (k < 1 || !t.leaf) continue
                const g = LEAF[0]
                const lx = Math.round(x + (hash(t.seed) - 0.5) * R) - 2
                const ly = Math.round(t.y + (hash(t.seed, 3) - 0.5) * R) - 2
                g.forEach((row, j) =>
                    [...row].forEach(
                        (b, i) =>
                            b === "#" &&
                            put(lx + i, ly + j, t.red ? RED : FAINT),
                    ),
                )
            }
        }

        // the bank the tree stands on: a low dotted mound
        const drawBank = () => {
            const bx = tree.base.x
            const half = Math.min(cols * 0.16, 34)
            for (let c = Math.floor(bx - half); c <= bx + half; c++) {
                const u = (c - bx) / half
                if (Math.abs(u) > 1) continue
                const top =
                    wy - 1 - Math.round(3.2 * Math.cos((u * Math.PI) / 2))
                if (c % 2 === 0 || Math.abs(u) < 0.6) put(c, top, SOFT)
                for (let r = top + 1; r < wy; r++)
                    if (bayer(c, r) < 0.18) put(c, r, FAINT)
            }
            // reeds at the far end of the water: fine curved stems bending
            // with the wind, a few with a seed head
            const rx = cols - 34 // the clump leans right; keep it inside
            for (let k = 0; k < 7; k++) {
                const x = rx + k * 2.6 + hash(k) * 3
                const h = 10 + hash(k, 1) * 14
                // the clump fans out, each stem curving over a little more at the top
                const lean = (k - 3) * 1.6 + (hash(k, 2) - 0.5) * 2
                const bend =
                    (0.55 * Math.sin(step * 0.031 + k * 0.5) + 0.3) * 2.5
                const head = hash(k, 3) < 0.45
                for (let j = 0; j < h; j++) {
                    const t = j / h
                    const c = x + lean * t + bend * t * t
                    const r = wy - 1 - j
                    if (head && t > 0.72 && t < 0.92) {
                        put(c, r, SOFT)
                        put(c + 1, r, SOFT) // the cattail's head
                    } else put(c, r, t > 0.92 ? FAINT : SOFT)
                }
            }
        }

        const draw = () => {
            grid.fill(0)
            drawBank()
            drawTree()
            for (const l of leaves) {
                if (l.floating) continue
                const g = LEAF[Math.floor(l.turn) % LEAF.length]
                const lx = Math.round(l.x - g[0].length / 2)
                const ly = Math.round(l.y - g.length / 2)
                g.forEach((row, j) =>
                    [...row].forEach(
                        (b, i) => b === "#" && put(lx + i, ly + j, RED),
                    ),
                )
            }

            ctx.clearRect(0, 0, el.width, el.height)
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
            for (let tone = 1; tone < TONE.length; tone++) {
                ctx.fillStyle = colors[tone]
                for (let r = 0; r < wy; r++)
                    for (let c = 0; c < cols; c++)
                        if (grid[r * cols + c] === tone) px(c, r)
            }

            // the water: a dotted line, the scene's reflection breaking up below it
            ctx.fillStyle = colors[PALE]
            for (let c = 0; c < cols; c += 2)
                if (noise(c * 0.08, step * 0.01) > 0.3) px(c, wy)
            for (let r = wy + 1; r < rows; r++) {
                const depth = (r - wy) / WATER
                const src = wy - (r - wy) // mirrored row
                if (src < 0) continue
                const wob = Math.round(
                    Math.sin(r * 0.9 + step * 0.12) * (0.5 + depth),
                )
                for (
                    let c = Math.max(0, wob);
                    c < Math.min(cols, cols + wob);
                    c++
                ) {
                    const tone = grid[src * cols + c - wob]
                    if (!tone || bayer(c, r) > 0.55 * (1 - depth)) continue
                    ctx.fillStyle = colors[tone === RED ? RED : PALE]
                    px(c, r)
                }
            }

            // leaves floating on the water, and the rings they make
            ctx.fillStyle = colors[RED]
            for (const l of leaves) {
                if (!l.floating || (l.life < 30 && step % 2)) continue
                FLOAT.forEach((row, j) =>
                    [...row].forEach(
                        (b, i) =>
                            b === "#" &&
                            px(Math.round(l.x) - 2 + i, wy - 1 + j),
                    ),
                )
            }
            ctx.fillStyle = colors[FAINT]
            for (const w of ripples) {
                const dense = 0.8 * (1 - w.r / w.max)
                const n = Math.ceil(Math.PI * w.r)
                for (let j = 0; j < n; j++) {
                    const a = (j / n) * Math.PI * 2
                    const c = Math.round(w.x + Math.cos(a) * w.r)
                    const r = Math.round(wy + Math.sin(a) * w.r * 0.28)
                    if (r >= wy && hash(j, w.x) < dense) px(c, r)
                }
            }
        }

        const drop = () => {
            const reds = tree.tips.filter((t) => t.red)
            const t =
                reds[Math.floor(Math.random() * reds.length)] || tree.tips[0]
            leaves.push({
                x: t.x + sway(t.depth),
                y: t.y,
                turn: Math.random() * 3,
                phase: Math.random() * 6,
                floating: false,
                life: 220,
            })
        }

        const tick = () => {
            step++
            if (grown < 1e6) grown++
            shake *= 0.93
            if (grown > 60 && --nextLeaf <= 0 && leaves.length < 5) {
                drop()
                nextLeaf = 70 + Math.floor(Math.random() * 90)
            }
            const wind =
                0.55 * Math.sin(step * 0.031) + 0.3 * Math.sin(step * 0.073 + 1)
            for (let n = leaves.length - 1; n >= 0; n--) {
                const l = leaves[n]
                if (!l.floating) {
                    // falling: drift with the wind, swing side to side, turn over
                    l.phase += 0.16
                    l.y += 0.32
                    l.x += wind * 0.35 + Math.sin(l.phase) * 0.45 + 0.08
                    l.turn += 0.18
                    if (l.y >= wy - 1) {
                        l.floating = true
                        ripples.push({ x: l.x, r: 1, max: 9 })
                    }
                } else {
                    l.x += 0.04 + wind * 0.03
                    if (--l.life <= 0 || l.x > cols + 4) leaves.splice(n, 1)
                }
            }
            for (let n = ripples.length - 1; n >= 0; n--)
                if ((ripples[n].r += 0.4) > ripples[n].max) ripples.splice(n, 1)
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

        // ---- pointer: the crown shakes a leaf loose, the water rings --------
        const local = (e) => {
            const r = el.getBoundingClientRect()
            return {
                x: (e.clientX - r.left) / CELL,
                y: (e.clientY - r.top) / CELL,
            }
        }
        const inCrown = (p) =>
            p.x > crown.x0 &&
            p.x < crown.x1 &&
            p.y > crown.y0 &&
            p.y < crown.y1 + 6
        const poke = (p) => {
            const now = performance.now()
            if (inCrown(p)) {
                if (now - lastShake < 900 || grown < 60) return
                lastShake = now
                shake = 1.2
                if (leaves.length < 7) drop()
            } else if (p.y > wy - 3) {
                ripples.push({ x: p.x, r: 1, max: 10 })
            }
        }
        const onMove = (e) =>
            e.pointerType === "mouse" &&
            !reduced &&
            inCrown(local(e)) &&
            poke(local(e))
        const onTap = (e) => !reduced && poke(local(e))

        readColors()
        layout()
        if (reduced)
            leaves.push({
                x: cols * 0.55,
                y: wy - 1,
                turn: 0,
                phase: 0,
                floating: true,
                life: 1e9,
            })
        draw()

        const ro = new ResizeObserver(() => {
            layout()
            draw()
        })
        ro.observe(box)
        const io = new IntersectionObserver(([e]) => {
            seen = e.isIntersecting
            run()
        })
        io.observe(box)
        const mo = new MutationObserver(() => {
            readColors()
            draw()
        })
        mo.observe(document.documentElement, { attributes: true })
        document.addEventListener("visibilitychange", run)
        box.addEventListener("pointermove", onMove, { passive: true })
        box.addEventListener("click", onTap)

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            io.disconnect()
            mo.disconnect()
            document.removeEventListener("visibilitychange", run)
            box.removeEventListener("pointermove", onMove)
            box.removeEventListener("click", onTap)
        }
    }, [reduced])

    return (
        <div ref={wrap} className={className} style={{ position: "relative" }}>
            <canvas
                ref={canvas}
                role="img"
                aria-label="A Japanese maple on a bank by still water, letting its red leaves fall"
                className="absolute inset-0 h-full w-full"
            />
        </div>
    )
}
