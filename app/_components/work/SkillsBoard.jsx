"use client"

import { cn } from "@/app/_lib/cn"

import { useSkillFocus } from "./skillFocus"

/**
 * The résumé's skill groups. Hover (or focus) a skill: roles and projects that
 * used it stay bright, the rest recede. Hover a role/project: its skills light up
 * here. Skills used somewhere on the page get a tiny count of where.
 */
export default function SkillsBoard({ groups, usage }) {
    const { skill, stack, setSkill } = useSkillFocus()
    return (
        <dl className="divide-y divide-line border-y border-line">
            {groups.map((g) => (
                <div
                    key={g.group}
                    className="grid gap-2 py-4 sm:grid-cols-[180px_1fr] sm:gap-6"
                >
                    <dt className="font-sans text-ui text-soft">{g.group}</dt>
                    <dd>
                        <ul className="flex flex-wrap gap-x-1 gap-y-1.5">
                            {g.names.map((n) => {
                                const used = usage[n] ?? 0
                                const lit =
                                    skill === n || (stack && stack.includes(n))
                                const dim =
                                    (skill && skill !== n) ||
                                    (stack && !stack.includes(n))
                                return (
                                    <li key={n}>
                                        <button
                                            type="button"
                                            onPointerEnter={() =>
                                                used && setSkill(n)
                                            }
                                            onPointerLeave={() =>
                                                setSkill(null)
                                            }
                                            onFocus={() => used && setSkill(n)}
                                            onBlur={() => setSkill(null)}
                                            aria-label={
                                                used
                                                    ? `${n}: used in ${used} ${used === 1 ? "role or project" : "roles and projects"} on this page`
                                                    : n
                                            }
                                            className={cn(
                                                "inline-flex items-baseline gap-1 rounded-sm px-1.5 py-0.5 text-small transition-[color,background-color,opacity] duration-[var(--duration-quick)]",
                                                lit
                                                    ? "bg-ink text-paper"
                                                    : "text-ink",
                                                dim && !lit && "opacity-35",
                                                used
                                                    ? "cursor-default hover:bg-tile"
                                                    : "cursor-default",
                                                lit && "hover:bg-ink",
                                            )}
                                        >
                                            {n}
                                            {used > 0 && (
                                                <sup
                                                    className={cn(
                                                        "font-pixel text-[9px]",
                                                        lit
                                                            ? "text-paper/70"
                                                            : "text-faint",
                                                    )}
                                                >
                                                    {used}
                                                </sup>
                                            )}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </dd>
                </div>
            ))}
        </dl>
    )
}
