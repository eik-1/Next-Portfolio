import { socials } from "@/app/_data/site"

import LocalTime from "./LocalTime"
import Maple from "./Maple"
import ThemeSwitch from "./ThemeSwitch"

/** A sign-off, not a sales pitch: a maple by still water, and the way out. */
export default function Footer() {
    return (
        <footer className="col-wide mt-32 border-t border-line pt-10 pb-10 font-sans text-ui text-soft md:pt-14">
            <Maple className="mb-8 h-[168px] w-full md:mb-10 md:h-[228px]" />
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <span>© {new Date().getFullYear()} Sarthak Rawat</span>
                    <span className="font-pixel text-pixel text-faint">
                        <LocalTime /> IST
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    {socials.map((s) => (
                        <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-[var(--duration-quick)] hover:text-ink"
                        >
                            {s.label}
                        </a>
                    ))}
                    <span className="h-3 w-px bg-line-2" aria-hidden />
                    <ThemeSwitch />
                </div>
            </div>
        </footer>
    )
}
