"use client"

import { AnimatePresence, motion } from "motion/react"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { site, socials } from "@/app/_data/site"
import { cn } from "@/app/_lib/cn"
import { ease } from "@/app/_lib/motion"
import { sound } from "@/app/_lib/sound"

function CopyEmail({ compact = false }) {
    const [copied, setCopied] = useState(false)
    const timer = useRef(0)
    useEffect(() => () => clearTimeout(timer.current), [])
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(site.email)
        } catch {
            window.location.href = `mailto:${site.email}`
            return
        }
        sound.ui("tick")
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), 1400)
    }
    return (
        <button
            type="button"
            onClick={copy}
            className={cn(
                "group inline-flex h-9 items-center gap-2 rounded-full px-3.5 font-sans text-ui text-ink ring-1 ring-inset ring-line-2 transition-colors duration-[var(--duration-quick)] hover:bg-tile",
                compact && "h-8 px-3",
            )}
            aria-label={
                copied ? "Email copied" : `Copy email address ${site.email}`
            }
        >
            <span className="relative grid h-3.5 w-3.5 place-items-center">
                <AnimatePresence initial={false} mode="popLayout">
                    {copied ? (
                        <motion.span
                            key="ok"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.16, ease: ease.drop }}
                        >
                            <Check
                                size={14}
                                strokeWidth={1.75}
                                className="text-live"
                            />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="cp"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                        >
                            <Copy size={13} strokeWidth={1.5} />
                        </motion.span>
                    )}
                </AnimatePresence>
            </span>
            {compact ? (
                <span>{copied ? "Copied" : "Email"}</span>
            ) : (
                <span>
                    {site.email}
                    <span
                        aria-live="polite"
                        className={cn(
                            "ml-2 font-pixel text-pixel text-live transition-opacity",
                            copied ? "opacity-100" : "opacity-0",
                        )}
                    >
                        copied
                    </span>
                </span>
            )}
        </button>
    )
}

function ResumeButton({ compact = false }) {
    return (
        <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.ui("press")}
            className={cn(
                "group inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 font-sans text-ui text-paper transition-[background-color,scale] duration-[var(--duration-quick)] hover:bg-ink/85 active:scale-[0.97]",
                compact && "h-8 px-3.5",
            )}
        >
            Résumé
            <ArrowUpRight
                size={14}
                strokeWidth={1.6}
                className="transition-transform duration-[var(--duration-quick)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
        </a>
    )
}

/**
 * The recruiter's shortcut: résumé + email at the very top of Work. Once the
 * header scrolls away, a compact pill with the same two actions stays at the
 * bottom of the screen, so the résumé is always one click away.
 */
export default function ResumeActions() {
    const sentinel = useRef(null)
    const [floating, setFloating] = useState(false)

    useEffect(() => {
        const el = sentinel.current
        if (!el) return
        const io = new IntersectionObserver(
            ([e]) =>
                setFloating(!e.isIntersecting && e.boundingClientRect.top < 0),
            { threshold: 0 },
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    const gh = socials.find((s) => s.label === "GitHub")
    const li = socials.find((s) => s.label === "LinkedIn")

    return (
        <>
            <div ref={sentinel} className="flex flex-wrap items-center gap-2.5">
                <ResumeButton />
                <CopyEmail />
                <span
                    className="mx-1 hidden h-4 w-px bg-line-2 sm:block"
                    aria-hidden
                />
                <span className="flex items-center">
                    {[gh, li].map((s) => (
                        <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-1.5 py-1 font-sans text-ui text-soft transition-colors hover:text-ink"
                        >
                            {s.label}
                        </a>
                    ))}
                </span>
            </div>
            <AnimatePresence>
                {floating && (
                    <motion.div
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{
                            y: 16,
                            opacity: 0,
                            transition: { duration: 0.14, ease: ease.exit },
                        }}
                        transition={{ duration: 0.24, ease: ease.drop }}
                        className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4"
                    >
                        <div className="flex items-center gap-1.5 rounded-full border border-line bg-paper/95 p-1 shadow-pop">
                            <span className="hidden pl-3 pr-1.5 font-sans text-ui text-soft sm:inline">
                                Sarthak Rawat
                            </span>
                            <ResumeButton compact />
                            <CopyEmail compact />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
