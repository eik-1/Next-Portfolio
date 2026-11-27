"use client"

import { useRef } from "react"

import { cn } from "@/app/_lib/cn"

import Develop from "./Develop"

/**
 * A 1-bit dithered image that turns to colour on hover.
 *  reveal="circle": the colour shows through a circle that follows the pointer
 *  reveal="fade":   the colour fades in over the whole frame
 * Touch / keyboard focus on a parent link fades in the colour too.
 * Writes CSS variables directly, so there are no React re-renders per frame.
 */
export default function Bitmap({
    bitmap,
    color,
    alt,
    reveal = "fade",
    radius = 72,
    className,
    imgClassName,
    priority = false,
    develop = false,
}) {
    const ref = useRef(null)
    const touched = useRef(false) // colour shown by a tap (touch has no hover)

    const aim = (e) => {
        const r = ref.current.getBoundingClientRect()
        ref.current.style.setProperty("--x", `${e.clientX - r.left}px`)
        ref.current.style.setProperty("--y", `${e.clientY - r.top}px`)
        return r
    }
    const move = (e) => {
        if (reveal !== "circle" || e.pointerType !== "mouse") return
        aim(e)
        ref.current.style.setProperty("--r", `${radius}px`)
    }
    const leave = (e) => {
        if (e.pointerType !== "mouse") return
        ref.current?.style.setProperty("--r", "0px")
    }
    // A tap floods the colour out from the finger; another tap takes it back.
    const tap = (e) => {
        if (reveal !== "circle" || e.pointerType === "mouse") return
        touched.current = !touched.current
        const r = aim(e)
        ref.current.style.setProperty(
            "--r",
            touched.current
                ? `${Math.ceil(Math.hypot(r.width, r.height))}px`
                : "0px",
        )
    }

    return (
        <div
            ref={ref}
            onPointerMove={move}
            onPointerLeave={leave}
            onPointerUp={tap}
            className={cn(
                "group/bitmap relative isolate overflow-hidden bg-paper",
                className,
            )}
            style={{ "--x": "50%", "--y": "50%", "--r": "0px" }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, tiny files */}
            <img
                src={bitmap}
                alt={alt}
                loading={priority ? "eager" : "lazy"}
                className={cn(
                    "bitmap absolute inset-0 h-full w-full object-cover",
                    imgClassName,
                )}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={color}
                alt=""
                aria-hidden
                loading="lazy"
                className={cn(
                    "absolute inset-0 h-full w-full object-cover",
                    reveal === "circle"
                        ? "[clip-path:circle(var(--r)_at_var(--x)_var(--y))] transition-[clip-path] duration-[var(--duration-base)] ease-[var(--ease-out)] group-focus-within/bitmap:[clip-path:circle(150%_at_50%_50%)]"
                        : "opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-standard)] group-hover/bitmap:opacity-100 [a:focus-visible_&]:opacity-100 [a:hover_&]:opacity-100",
                    imgClassName,
                )}
            />
            {develop && <Develop />}
        </div>
    )
}
