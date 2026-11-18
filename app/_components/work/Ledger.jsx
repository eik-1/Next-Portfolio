"use client"

import { AnimatePresence, motion } from "motion/react"
import { ArrowUpRight, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useId, useState } from "react"

import Bitmap from "@/app/_components/ui/Bitmap"
import ArchitectureDiagram from "@/app/_components/work/diagrams/ArchitectureDiagram"
import { cn } from "@/app/_lib/cn"
import { ease } from "@/app/_lib/motion"
import { sound } from "@/app/_lib/sound"

import { useMatches, useSkillFocus } from "./skillFocus"

/** Set the numbers in a bullet in ink, so a skimming reader catches them. */
function Figures({ text }) {
    const parts = text.split(
        /((?<![\w-])~?\d+\+?%?(?:\s(?:microservices|tables|SQL functions|data channels))?)/g,
    )
    return parts.map((p, i) =>
        i % 2 ? (
            <span key={i} className="text-ink">
                {p}
            </span>
        ) : (
            p
        ),
    )
}

function Stack({ items }) {
    const { setStack, skill } = useSkillFocus()
    return (
        <ul
            className="flex flex-wrap gap-1.5"
            onPointerEnter={() => setStack(items)}
            onPointerLeave={() => setStack(null)}
        >
            {items.map((s) => (
                <li
                    key={s}
                    className={cn(
                        "rounded-sm border px-2 py-0.5 font-sans text-ui transition-colors duration-[var(--duration-quick)]",
                        skill === s
                            ? "border-ink bg-ink text-paper"
                            : "border-line text-soft",
                    )}
                >
                    {s}
                </li>
            ))}
        </ul>
    )
}

const panel = {
    initial: { height: 0, opacity: 0 },
    animate: {
        height: "auto",
        opacity: 1,
        transition: {
            height: { duration: 0.32, ease: ease.drop },
            opacity: { duration: 0.2, delay: 0.06 },
        },
    },
    exit: {
        height: 0,
        opacity: 0,
        transition: {
            height: { duration: 0.24, ease: ease.standard },
            opacity: { duration: 0.1 },
        },
    },
}

function Row({ open, onToggle, head, children, stack, id }) {
    const { active, match } = useMatches(stack)
    return (
        <li
            className={cn(
                "border-t border-line transition-opacity duration-[var(--duration-base)]",
                active && !match && "opacity-30",
            )}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={id}
                className="group -mx-3 flex w-[calc(100%+1.5rem)] items-center gap-4 rounded-lg px-3 py-4 text-left transition-colors duration-[var(--duration-quick)] hover:bg-tile md:gap-5"
            >
                {head}
                <span
                    aria-hidden
                    className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center font-sans text-ui text-soft transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)]",
                        open && "rotate-45",
                    )}
                >
                    +
                </span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        id={id}
                        key="panel"
                        {...panel}
                        className="overflow-hidden"
                    >
                        <div className="pb-8 pt-2">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </li>
    )
}

function ExperienceRow({ job }) {
    const { active, match } = useMatches(job.stack)
    return (
        <li
            className={cn(
                "border-t border-line transition-opacity duration-[var(--duration-base)]",
                active && !match && "opacity-30",
            )}
        >
            <div className="flex items-center gap-4 py-4 md:gap-5">
                <Image
                    src={job.logo}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-md ring-1 ring-line"
                />
                <span className="min-w-0 flex-1">
                    <span className="block text-read text-ink">{job.role}</span>
                    <span className="block font-sans text-ui text-soft">
                        {job.company}
                    </span>
                    <span className="mt-1 block font-pixel text-pixel text-faint sm:hidden">
                        {job.period}
                    </span>
                </span>
                <span className="ml-auto hidden shrink-0 text-right font-pixel text-pixel text-faint sm:block">
                    {job.period}
                </span>
                <span
                    aria-hidden
                    className="invisible hidden w-6 shrink-0 sm:block"
                />
            </div>
            <div className="pb-8 pt-2">
                <ul className="space-y-3 text-small text-soft">
                    {job.bullets.map((b) => (
                        <li key={b.slice(0, 24)} className="flex gap-3">
                            <span
                                aria-hidden
                                className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-faint"
                            />
                            <span>
                                <Figures text={b} />
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="mt-6">
                    <Stack items={job.stack} />
                </div>
                {job.diagram && (
                    <div className="mt-8">
                        <p className="label mb-3">How it&apos;s built</p>
                        <ArchitectureDiagram name={job.diagram} />
                    </div>
                )}
            </div>
        </li>
    )
}

export function ExperienceLedger({ items }) {
    return (
        <ul className="border-b border-line">
            {items.map((job) => (
                <ExperienceRow key={job.company} job={job} />
            ))}
        </ul>
    )
}

export function ProjectLedger({ items }) {
    const [open, setOpen] = useState(() => new Set([items[0]?.slug]))
    const base = useId()
    const toggle = (k) => {
        sound.ui(open.has(k) ? "close" : "open")
        setOpen((s) => {
            const n = new Set(s)
            if (n.has(k)) n.delete(k)
            else n.add(k)
            return n
        })
    }
    return (
        <ul className="border-b border-line">
            {items.map((t, i) => {
                const isOpen = open.has(t.slug)
                return (
                    <Row
                        key={t.slug}
                        id={`${base}-${i}`}
                        open={isOpen}
                        onToggle={() => toggle(t.slug)}
                        stack={t.stack}
                        head={
                            <>
                                <Bitmap
                                    bitmap={t.bitmap}
                                    color={t.thumb}
                                    alt=""
                                    className="aspect-[8/5] w-16 shrink-0 rounded-sm ring-1 ring-line md:w-20"
                                />
                                <span className="min-w-0 flex-1">
                                    <span className="block text-read text-ink">
                                        {t.title}
                                    </span>
                                    <span className="block truncate font-sans text-ui text-soft">
                                        {t.summary}
                                    </span>
                                </span>
                                <span className="ml-auto w-14 shrink-0 text-right font-pixel text-pixel text-faint">
                                    {t.year}
                                </span>
                            </>
                        }
                    >
                        <div className="grid gap-6 md:grid-cols-[1fr_220px]">
                            <div>
                                <p className="text-small text-soft">
                                    {t.body[0]}
                                </p>
                                <ul className="mt-4 space-y-1.5 font-sans text-ui text-ink">
                                    {t.highlights.map((h) => (
                                        <li key={h} className="flex gap-2.5">
                                            <span
                                                aria-hidden
                                                className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-red"
                                            />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Bitmap
                                bitmap={t.bitmap}
                                color={t.thumb}
                                alt={`${t.title}`}
                                className="hidden aspect-[8/5] w-full rounded-md ring-1 ring-line md:block"
                            />
                        </div>
                        <div className="mt-6">
                            <Stack items={t.stack} />
                        </div>
                        {t.diagram && (
                            <div className="mt-6">
                                <ArchitectureDiagram name={t.diagram} />
                            </div>
                        )}
                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-ui">
                            <Link
                                href={`/project/${t.slug}`}
                                className="text-ink underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-ink"
                            >
                                Read the case study
                            </Link>
                            {t.links.live && (
                                <a
                                    href={t.links.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-0.5 text-soft transition-colors hover:text-ink"
                                >
                                    {t.links.live
                                        .replace(/^https?:\/\/(www\.)?/, "")
                                        .replace(/\/$/, "")}
                                    <ArrowUpRight size={12} strokeWidth={1.5} />
                                </a>
                            )}
                            {t.links.github ? (
                                <a
                                    href={t.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-0.5 text-soft transition-colors hover:text-ink"
                                >
                                    Source
                                    <ArrowUpRight size={12} strokeWidth={1.5} />
                                </a>
                            ) : (
                                t.links.private && (
                                    <span className="inline-flex items-center gap-1 text-faint">
                                        <Lock size={11} strokeWidth={1.5} />{" "}
                                        Private repo
                                    </span>
                                )
                            )}
                        </div>
                    </Row>
                )
            })}
        </ul>
    )
}
