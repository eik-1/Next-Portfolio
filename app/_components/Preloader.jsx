"use client"

import { motion } from "framer-motion"
import { neueMontrealThin } from "../fonts/fonts"

function Preloader() {
    return (
        <motion.div
            className="fixed inset-0 flex flex-col justify-center items-center bg-on-surface z-[9999]"
            initial={{ y: 0 }}
            exit={{
                y: "-100%",
                transition: {
                    duration: 0.8,
                    ease: [0.76, 0, 0.24, 1],
                    delay: 0.1,
                },
            }}
        >
            {/* Subtle noise grain — adds tactile depth to the dark surface */}
            <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative flex flex-col items-center">
                {/* Name — staggered letter rise from below */}
                <div className="flex items-baseline overflow-hidden">
                    {["E", "I", "K"].map((letter, i) => (
                        <motion.span
                            key={letter}
                            className={`${neueMontrealThin.className} text-on-accent text-7xl lg:text-8xl tracking-wider`}
                            initial={{ y: "120%" }}
                            animate={{ y: "0%" }}
                            transition={{
                                duration: 0.6,
                                ease: [0.33, 1, 0.68, 1],
                                delay: 0.25 + i * 0.08,
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                    {/* The signature red dot — overshoots then settles */}
                    <motion.span
                        className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-accent ml-1 mb-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.34, 1.56, 0.64, 1],
                            delay: 0.6,
                        }}
                    />
                </div>

                {/* Accent line — draws from center outward */}
                <motion.div
                    className="h-px bg-accent mt-3"
                    initial={{ width: 0 }}
                    animate={{ width: "5rem" }}
                    transition={{
                        duration: 0.5,
                        ease: [0.33, 1, 0.68, 1],
                        delay: 0.7,
                    }}
                />
            </div>
        </motion.div>
    )
}

export default Preloader
