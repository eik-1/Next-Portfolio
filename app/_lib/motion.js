/**
 * Motion tokens — one source for every animation on the site.
 * Mirrors the CSS custom properties in globals.css and DESIGN.md → Motion.
 *
 * Rules (from the animation guidelines we follow):
 *  - Animate transform / opacity / clip-path only.
 *  - UI feedback ≤ 240ms. Only "story" moments (once per visit) go longer.
 *  - Everything is interruptible; nothing blocks input.
 *  - Every motion has a reduced-motion fallback (usually: final state, instantly).
 */

export const ease = {
    standard: [0.2, 0, 0, 1], // most state changes
    drop: [0.16, 1, 0.3, 1], // "needle drop": entrances, reveals
    exit: [0.4, 0, 1, 1], // leaving the screen
    flip: [0.76, 0, 0.24, 1], // sleeve / page / theme flips
}

export const duration = {
    press: 0.09,
    quick: 0.16,
    base: 0.24,
    slow: 0.42,
    story: 0.7,
}

export const spring = {
    // Pressables: buttons, chips, magnetic targets
    press: { type: "spring", stiffness: 520, damping: 32, mass: 0.6 },
    // Platter: things with weight — the record, cards, the island
    platter: { type: "spring", stiffness: 260, damping: 28, mass: 1 },
    // Layout morphs (one surface growing into another)
    morph: { type: "spring", stiffness: 380, damping: 36 },
}
