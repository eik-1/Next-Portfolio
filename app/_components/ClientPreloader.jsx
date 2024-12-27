"use client"

import { useEffect, useState } from "react"
import Preloader from "./Preloader"

export default function ClientPreloader({ children }) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return isLoading ? <Preloader /> : <>{children}</>
}
