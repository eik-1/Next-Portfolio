import Image from "next/image"

import { cn } from "@/app/_lib/cn"
import cafe from "@/public/me/cafe.jpeg"
import portrait from "@/public/me/portrait.webp"

/**
 * The about-page photos: two (max three) prints laid slightly askew, the way
 * you'd put them on a desk. Hover straightens one and lifts it.
 * Add a third by appending to PHOTOS.
 */
const PHOTOS = [
    { id: "cafe", src: cafe, alt: "Sarthak in a café", tilt: "-rotate-2" },
    {
        id: "portrait",
        src: portrait,
        alt: "Sarthak, portrait",
        tilt: "rotate-[1.5deg] sm:translate-y-6",
    },
]

export default function PhotoDeck() {
    return (
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {PHOTOS.map((p) => (
                <figure
                    key={p.id}
                    className={cn(
                        "group transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] hover:z-10 hover:rotate-0 hover:-translate-y-1",
                        p.tilt,
                    )}
                >
                    <div className="overflow-hidden rounded-lg bg-tile p-1.5 shadow-pop ring-1 ring-line">
                        <Image
                            src={p.src}
                            alt={p.alt}
                            placeholder="blur"
                            sizes="(min-width: 640px) 300px, 45vw"
                            className="aspect-[4/5] w-full rounded-md object-cover"
                        />
                    </div>
                </figure>
            ))}
        </div>
    )
}
