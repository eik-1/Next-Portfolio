"use client"

import { useEffect, useRef } from "react"

const KEY = "eik:developed"

/**
 * "Developing" a 1-bit image: a paper-coloured canvas sits over its parent and
 * clears in random 8px blocks, so the picture prints itself onto the page.
 * ~850ms, once per session, skipped with reduced motion. Purely decorative,
 * pointer-transparent, and hidden when done.
 */
export default function Develop({ cell = 8, duration = 850 }) {
    const ref = useRef(null)

    useEffect(() => {
        const canvas = ref.current
        if (!canvas) return
        let seen = false
        try {
            seen = sessionStorage.getItem(KEY) === "1"
        } catch {}
        if (
            seen ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            canvas.style.display = "none"
            return
        }

        const box = canvas.parentElement.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.ceil(box.width * dpr)
        canvas.height = Math.ceil(box.height * dpr)
        const ctx = canvas.getContext("2d")
        const paper =
            getComputedStyle(document.documentElement)
                .getPropertyValue("--paper")
                .trim() || "#fbfbf9"
        ctx.fillStyle = paper
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const c = cell * dpr
        const cols = Math.ceil(canvas.width / c)
        const rows = Math.ceil(canvas.height / c)
        const cells = Array.from({ length: cols * rows }, (_, i) => i)
        // Shuffle, but bias toward the centre so the face develops first.
        const cx = cols / 2
        const cy = rows / 2
        const weight = cells.map((i) => {
            const x = i % cols
            const y = Math.floor(i / cols)
            return (
                Math.hypot((x - cx) / cols, (y - cy) / rows) +
                Math.random() * 0.55
            )
        })
        cells.sort((a, b) => weight[a] - weight[b])

        let raf = 0
        let done = 0
        const start = performance.now()
        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3) // ease-out
            const target = Math.floor(eased * cells.length)
            for (; done < target; done++) {
                const i = cells[done]
                ctx.clearRect((i % cols) * c, Math.floor(i / cols) * c, c, c)
            }
            if (t < 1) raf = requestAnimationFrame(tick)
            else {
                canvas.style.display = "none"
                try {
                    sessionStorage.setItem(KEY, "1")
                } catch {}
            }
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [cell, duration])

    return (
        <canvas
            ref={ref}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 h-full w-full [image-rendering:pixelated]"
        />
    )
}
