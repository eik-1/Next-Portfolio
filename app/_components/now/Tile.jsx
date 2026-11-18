import { cn } from "@/app/_lib/cn"

/**
 * A soft square that holds one object, with a small caption under it.
 * `aside` is an optional bit of live state, set in pixel type on the right.
 * `@container` lets the object inside scale down when the tile is narrow.
 */
export default function Tile({ caption, aside, children, className }) {
    return (
        <figure className="m-0">
            <div
                className={cn(
                    "@container relative aspect-square overflow-hidden rounded-lg bg-tile",
                    className,
                )}
            >
                {children}
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-3 px-1">
                <span className="label">{caption}</span>
                {aside ? (
                    <span className="min-w-0 truncate font-pixel text-pixel text-soft">
                        {aside}
                    </span>
                ) : null}
            </figcaption>
        </figure>
    )
}
