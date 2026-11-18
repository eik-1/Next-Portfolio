import { cn } from "@/app/_lib/cn"

const BARS = [0.45, 1, 0.7]

/**
 * Three bars. They only move while something is genuinely playing
 * (`active`); otherwise they rest at fixed heights in a quiet grey.
 */
export default function Equalizer({ active = false, className }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "inline-flex h-[10px] items-end gap-[2px]",
                active ? "text-red" : "text-faint",
                className,
            )}
        >
            {BARS.map((rest, i) => (
                <span
                    key={i}
                    className={cn(
                        "h-full w-[2px] origin-bottom bg-current",
                        active && "animate-eq",
                    )}
                    style={
                        active
                            ? { animationDelay: `${-i * 0.27}s` }
                            : { transform: `scaleY(${rest})` }
                    }
                />
            ))}
        </span>
    )
}
