"use client"

import { useSyncExternalStore } from "react"

/**
 * Theme store. The attribute lives on <html data-theme>, set before paint by
 * the inline script in layout.js (no flash). Choice persists in localStorage.
 */
const KEY = "eik:theme"

/** Inline, pre-hydration script. Keep it tiny and dependency-free. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`

function read() {
    if (typeof document === "undefined") return "light"
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light"
}

function subscribe(fn) {
    const obs = new MutationObserver(fn)
    obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
    })
    return () => obs.disconnect()
}

function setTheme(next) {
    document.documentElement.dataset.theme = next
    try {
        localStorage.setItem(KEY, next)
    } catch {}
}

export function useTheme() {
    const theme = useSyncExternalStore(subscribe, read, () => "light")
    return {
        theme,
        setTheme,
        toggle: () => setTheme(read() === "dark" ? "light" : "dark"),
    }
}
