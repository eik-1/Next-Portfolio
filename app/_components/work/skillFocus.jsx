"use client"

import { createContext, useContext, useMemo, useState } from "react"

/**
 * Cross-highlighting on the Work page: hover a skill and every role and project
 * that used it stays bright while the rest recede. Hover a row and its skills
 * light up in the skills list.
 */
const Ctx = createContext({
    skill: null,
    stack: null,
    setSkill: () => {},
    setStack: () => {},
})

export function SkillFocusProvider({ children }) {
    const [skill, setSkill] = useState(null)
    const [stack, setStack] = useState(null)
    const value = useMemo(
        () => ({ skill, stack, setSkill, setStack }),
        [skill, stack],
    )
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useSkillFocus = () => useContext(Ctx)

/** True when nothing is focused, or when this stack contains the focused skill. */
export function useMatches(stack = []) {
    const { skill } = useSkillFocus()
    return { active: Boolean(skill), match: !skill || stack.includes(skill) }
}
