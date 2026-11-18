/**
 * Small helpers shared by the code-drawn pixel art (the hero's koi pond and
 * the footer's maple): ordered dither, hash noise, angles, a seeded random.
 */

// 4×4 ordered (Bayer) dither: bayer(c, r) < density decides if a cell is inked
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
    (v) => (v + 0.5) / 16,
)
export const bayer = (c, r) => BAYER[(r & 3) * 4 + (c & 3)]

export const hash = (x, y = 0) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
    return s - Math.floor(s)
}

// smooth value noise in 0..1
export const noise = (x, y = 0) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const u = (x - xi) * (x - xi) * (3 - 2 * (x - xi))
    const v = (y - yi) * (y - yi) * (3 - 2 * (y - yi))
    const a = hash(xi, yi)
    const b = hash(xi + 1, yi)
    const c = hash(xi, yi + 1)
    const d = hash(xi + 1, yi + 1)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

// the signed shortest turn from one angle to another
export const angleTo = (from, to) =>
    Math.atan2(Math.sin(to - from), Math.cos(to - from))

// a seeded random (mulberry32), so generated art is the same on every visit
export const seeded = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
