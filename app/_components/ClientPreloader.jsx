"use client"

import { useEffect, useState } from "react"
import Preloader from "./Preloader"

export default function ClientPreloader({ children }) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Load immediately if page was previously visited (browser back button)
        if (window.performance) {
            const navEntries = performance.getEntriesByType("navigation")
            if (
                navEntries.length > 0 &&
                navEntries[0].type === "back_forward"
            ) {
                setIsLoading(false)
                return
            }
        }

        // Otherwise, short preloader
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000) // Reduced from 2000ms to 1000ms

        return () => clearTimeout(timer)
    }, [])

    return isLoading ? <Preloader /> : <>{children}</>
}
