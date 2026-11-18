"use client"

import { useEffect, useRef, useState } from "react"

import github from "@/app/_data/github.json"
import { cn } from "@/app/_lib/cn"

import { count } from "./format"

const TYPE_MS = 35 // per character
const ENTER_MS = 280 // the pause after the command is typed
const LINE_MS = 140 // between printed lines
const COPIED_MS = 1200

// What the package sets up, from its own description. No invented figures.
const OUTPUT = ["+ project documents", "+ agent skills", "ready"]

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        // Older browsers and non-secure origins: fall back to a hidden field.
        const field = document.createElement("textarea")
        field.value = text
        field.setAttribute("readonly", "")
        field.style.cssText = "position:fixed;top:0;left:0;opacity:0"
        document.body.appendChild(field)
        field.select()
        let ok = false
        try {
            ok = document.execCommand("copy")
        } catch {}
        field.remove()
        return ok
    }
}

/**
 * A small terminal for an npm package: when it scrolls into view it types the
 * install command once, prints a few lines, and ends on last month's real
 * download count. "Copy" puts the command on the clipboard.
 *
 * Props:
 *   name   which package from github.json → npm (default: the first)
 *   lines  the short lines printed after the command
 */
export default function NpmTerminal({ name, lines = OUTPUT, className }) {
    const pkg = github.npm.find((p) => p.name === name) ?? github.npm[0]
    const command = pkg ? `npx ${pkg.name}@latest` : ""
    const end = command.length + lines.length + 1

    // 0 → nothing yet; one tick per typed character, then one per printed line.
    const [tick, setTick] = useState(0)
    const [copied, setCopied] = useState(false)
    const root = useRef(null)
    const copiedTimer = useRef(null)

    useEffect(() => {
        const el = root.current
        if (!el) return
        let timer
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                io.disconnect()
                if (
                    window.matchMedia("(prefers-reduced-motion: reduce)")
                        .matches
                )
                    return setTick(end)
                let n = 0
                const step = () => {
                    n += 1
                    setTick(n)
                    if (n < end)
                        timer = setTimeout(
                            step,
                            n < command.length
                                ? TYPE_MS
                                : n === command.length
                                  ? ENTER_MS
                                  : LINE_MS,
                        )
                }
                timer = setTimeout(step, 320)
            },
            { threshold: 0.6 },
        )
        io.observe(el)
        return () => {
            io.disconnect()
            clearTimeout(timer)
        }
    }, [command.length, end])

    useEffect(() => () => clearTimeout(copiedTimer.current), [])

    if (!pkg) return null

    const typed = Math.min(tick, command.length)
    const printed = Math.max(0, tick - command.length) // lines shown, the downloads line last
    const idle = tick === 0 || tick >= end

    const onCopy = async () => {
        if (!(await copyText(command))) return
        setCopied(true)
        clearTimeout(copiedTimer.current)
        copiedTimer.current = setTimeout(() => setCopied(false), COPIED_MS)
    }

    const cursor = (
        <span
            aria-hidden="true"
            className={cn(
                "ml-[0.5ch] inline-block h-[11px] w-[1ch] translate-y-px bg-red",
                idle && "animate-blink",
            )}
        />
    )

    return (
        <div
            ref={root}
            role="group"
            aria-label={`${pkg.name} on npm`}
            className={cn(
                "rounded-lg bg-ink p-4 font-pixel text-pixel text-paper sm:p-5",
                className,
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 break-words">
                    <span aria-hidden="true" className="text-paper/70">
                        ${" "}
                    </span>
                    {/* The untyped part keeps its place, so the line never reflows while typing. */}
                    <span>{command.slice(0, typed)}</span>
                    {printed === 0 ? cursor : null}
                    <span className="invisible">{command.slice(typed)}</span>
                </p>
                <button
                    type="button"
                    onClick={onCopy}
                    aria-label={copied ? "Copied" : "Copy command"}
                    className="-my-1 min-w-[calc(6ch+14px)] shrink-0 rounded-sm border border-paper/25 px-1.5 py-0.5 text-center text-paper/70 transition-colors duration-[var(--duration-quick)] ease-[var(--ease-standard)] hover:border-paper/50 hover:text-paper focus-visible:outline-paper active:bg-paper/10"
                >
                    {copied ? "copied" : "Copy"}
                </button>
            </div>

            <div className="mt-1 text-paper/70">
                {lines.map((line, i) => (
                    <p key={line} className={cn(printed <= i && "invisible")}>
                        {line}
                    </p>
                ))}
                <p
                    className={cn(
                        "mt-3",
                        printed <= lines.length && "invisible",
                    )}
                >
                    <a
                        href={pkg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-paper/30 decoration-1 underline-offset-[3px] transition-colors duration-[var(--duration-quick)] hover:decoration-paper focus-visible:outline-paper"
                    >
                        <span className="text-paper">
                            {count(pkg.downloadsLastMonth)}
                        </span>{" "}
                        downloads last month
                    </a>
                    {printed > lines.length ? cursor : null}
                </p>
            </div>

            <span role="status" className="sr-only">
                {copied ? "Command copied" : ""}
            </span>
        </div>
    )
}
