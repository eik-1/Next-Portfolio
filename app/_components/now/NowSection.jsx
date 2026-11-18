"use client"

import { cn } from "@/app/_lib/cn"

import BookStack from "./BookStack"
import PixelClock from "./PixelClock"
import RecordPlayer from "./RecordPlayer"

const item = "w-[78%] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none"

/**
 * "Now": three small objects on soft tiles. What I'm listening to (the record
 * player, which also carries the opt-in ambient sound), what I'm reading, and
 * what time it is here. Three columns from md up; a snap-scrolling row on phones.
 */
export default function NowSection({ className }) {
    return (
        <section
            aria-labelledby="now-title"
            className={cn("col-wide", className)}
        >
            <h2 id="now-title" className="label">
                Now
            </h2>
            <ul className="no-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
                <li className={item}>
                    <RecordPlayer />
                </li>
                <li className={item}>
                    <BookStack />
                </li>
                <li className={item}>
                    <PixelClock />
                </li>
            </ul>
        </section>
    )
}
