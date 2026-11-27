import { PLANK, u } from "./shelf"

/** The plank a row of books stands on. Each book draws it under itself; the row clips it to the column. */
export default function Plank() {
    return (
        <span
            aria-hidden
            className="pointer-events-none absolute -inset-x-[100vw] top-full block border-t border-b border-[color-mix(in_srgb,var(--ink)_22%,var(--paper))] border-b-line bg-tile-2"
            style={{ height: u(PLANK) }}
        />
    )
}
