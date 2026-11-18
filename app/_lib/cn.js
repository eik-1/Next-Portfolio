import { clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge the v3 type scale and colour tokens so a size class and
// a colour class (e.g. "text-ui text-soft") are never collapsed into one.
const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            "font-size": [
                {
                    text: [
                        "pixel",
                        "ui",
                        "small",
                        "read",
                        "intro",
                        "title",
                        "name",
                    ],
                },
            ],
        },
        theme: {
            color: [
                "paper",
                "tile",
                "tile-2",
                "line",
                "line-2",
                "ink",
                "soft",
                "faint",
                "red",
                "on-red",
                "live",
            ],
        },
    },
})

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
