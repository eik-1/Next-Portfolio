"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import Mark from "@/app/_components/brand/Mark"
import AmbientButton from "@/app/_components/chrome/AmbientButton"
import { cn } from "@/app/_lib/cn"

const LINKS = [
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/library", label: "Library" },
]

const active = (path, href) =>
    path === href ||
    path.startsWith(`${href}/`) ||
    (href === "/work" && path.startsWith("/project"))

/** Quiet top bar: your name on the left, three links and the ambient music switch on the right. Nothing fixed, nothing glassy. */
export default function Navbar() {
    const path = usePathname()
    return (
        <>
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:font-sans focus:text-ui focus:text-paper"
            >
                Skip to content
            </a>
            <header className="col-wide flex h-20 items-center justify-between">
                <Link
                    href="/"
                    className="-m-2 p-2 text-ink"
                    aria-label="eik, Sarthak Rawat, home"
                >
                    <Mark className="h-[26px]" />
                </Link>
                <nav
                    aria-label="Primary"
                    className="flex items-center gap-5 font-sans text-ui"
                >
                    {LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            aria-current={
                                active(path, l.href) ? "page" : undefined
                            }
                            className={cn(
                                "relative transition-colors duration-[var(--duration-quick)]",
                                active(path, l.href)
                                    ? "text-ink"
                                    : "text-soft hover:text-ink",
                            )}
                        >
                            {l.label}
                            {active(path, l.href) && (
                                <span
                                    aria-hidden
                                    className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red"
                                />
                            )}
                        </Link>
                    ))}
                    <span aria-hidden className="h-3 w-px bg-line-2" />
                    <AmbientButton />
                </nav>
            </header>
        </>
    )
}
