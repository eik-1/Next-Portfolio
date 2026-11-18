"use client"

import { useTheme } from "@/app/_lib/theme"

/** A small text switch: "Light · Dark". The active word is ink; the other is soft. */
export default function ThemeSwitch({ className = "" }) {
    const { theme, setTheme } = useTheme()
    return (
        <div
            className={`flex items-center gap-1.5 font-sans text-ui ${className}`}
            role="group"
            aria-label="Theme"
        >
            {["light", "dark"].map((t, i) => (
                <span key={t} className="flex items-center gap-1.5">
                    {i > 0 && (
                        <span className="text-faint" aria-hidden>
                            ·
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => setTheme(t)}
                        aria-pressed={theme === t}
                        className={`capitalize transition-colors duration-[var(--duration-quick)] ${theme === t ? "text-ink" : "text-soft hover:text-ink"}`}
                    >
                        {t}
                    </button>
                </span>
            ))}
        </div>
    )
}
