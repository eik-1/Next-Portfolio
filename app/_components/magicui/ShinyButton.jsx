"use client"

import { motion } from "framer-motion"
import { ChevronRightIcon } from "lucide-react"
import React from "react"

import { neueMontrealMedium } from "@/app/fonts/fonts"

const animationProps = {
    initial: { "--x": "100%", scale: 0.8 },
    animate: { "--x": "-100%", scale: 1 },
    whileTap: { scale: 0.95 },
    transition: {
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 1,
        type: "spring",
        stiffness: 20,
        damping: 15,
        mass: 2,
        scale: {
            type: "spring",
            stiffness: 200,
            damping: 5,
            mass: 0.5,
        },
    },
}

const ShinyButton = ({ text = "shiny-button", githubUrl }) => {
    const handleClick = () => {
        window.open(githubUrl, "_blank", "noopener,noreferrer")
    }
    return (
        <motion.button
            {...animationProps}
            onClick={handleClick}
            className="relative rounded-lg px-6 py-2.5 font-bold transition-shadow duration-300 ease-in-out hover:shadow-[0_0_24px_rgba(239,68,68,0.2)] bg-on-surface"
        >
            <span
                className={`${neueMontrealMedium.className} antialiased tracking-wide relative flex items-center justify-center h-full w-full text-sm uppercase text-on-accent`}
                style={{
                    maskImage:
                        "linear-gradient(-75deg, #fff calc(var(--x) + 20%), transparent calc(var(--x) + 25%), #fff calc(var(--x) + 100%))",
                }}
            >
                {text} <ChevronRightIcon size={18} className="ml-1" />
            </span>
            <span
                style={{
                    mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                    maskComposite: "exclude",
                }}
                className="absolute inset-0 z-10 block rounded-[inherit] p-[2px]"
            >
                <span
                    className="absolute inset-0 rounded-[inherit]"
                    style={{
                        background:
                            "linear-gradient(-75deg, rgba(255,255,255,0.15) calc(var(--x) + 20%), rgba(255,255,255,0.9) calc(var(--x) + 25%), rgba(255,255,255,0.15) calc(var(--x) + 100%))",
                    }}
                />
            </span>
        </motion.button>
    )
}

export default ShinyButton
