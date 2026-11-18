import Link from "next/link"

import Bitmap from "@/app/_components/ui/Bitmap"
import { projects } from "@/app/_data/work"

/** Quiet rows: a small dithered thumbnail, a name, one line, the year. */
export default function WorkList({ items = projects }) {
    return (
        <ul className="-mx-3">
            {items.map((t) => (
                <li key={t.slug}>
                    <Link
                        href={`/project/${t.slug}`}
                        className="group grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-lg p-3 transition-colors duration-[var(--duration-quick)] hover:bg-tile md:grid-cols-[96px_1fr_auto] md:gap-5"
                    >
                        <Bitmap
                            bitmap={t.bitmap}
                            color={t.thumb}
                            alt=""
                            className="aspect-[8/5] w-full rounded-md ring-1 ring-line"
                        />
                        <span className="min-w-0">
                            <span className="block text-read text-ink">
                                {t.title}
                            </span>
                            <span className="block truncate font-sans text-ui text-soft">
                                {t.summary}
                            </span>
                        </span>
                        <span className="font-pixel text-pixel text-faint">
                            {t.year}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    )
}
