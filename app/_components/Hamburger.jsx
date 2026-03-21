"use client"

import { MotionConfig, motion } from "framer-motion"

export default function HamburgerButton({ isOpen, toggleMenu }) {
    return (
        <MotionConfig
            transition={{
                duration: 0.5,
                ease: "easeInOut",
            }}
        >
            <motion.button
                initial={false}
                animate={isOpen ? "open" : "closed"}
                onClick={toggleMenu}
                className="relative h-12 w-12 rounded-full transition-colors"
                aria-label="Toggle menu"
            >
                <motion.span
                    variants={VARIANTS.top}
                    className="absolute h-[2px] w-6 bg-on-surface rounded-full"
                    style={{ y: "-50%", left: "50%", x: "-50%", top: "35%" }}
                />
                <motion.span
                    variants={VARIANTS.middle}
                    className="absolute h-[2px] w-6 bg-on-surface rounded-full"
                    style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
                />
                <motion.span
                    variants={VARIANTS.bottom}
                    className="absolute h-[2px] w-3.5 bg-on-surface rounded-full"
                    style={{
                        x: "-50%",
                        y: "50%",
                        bottom: "35%",
                        left: "calc(50% + 5px)",
                    }}
                />
            </motion.button>
        </MotionConfig>
    )
}

const VARIANTS = {
    top: {
        open: {
            rotate: ["0deg", "0deg", "45deg"],
            top: ["35%", "50%", "50%"],
        },
        closed: {
            rotate: ["45deg", "0deg", "0deg"],
            top: ["50%", "50%", "35%"],
        },
    },
    middle: {
        open: {
            rotate: ["0deg", "0deg", "-45deg"],
        },
        closed: {
            rotate: ["-45deg", "0deg", "0deg"],
        },
    },
    bottom: {
        open: {
            rotate: ["0deg", "0deg", "45deg"],
            bottom: ["35%", "50%", "50%"],
            left: "50%",
        },
        closed: {
            rotate: ["45deg", "0deg", "0deg"],
            bottom: ["50%", "50%", "35%"],
            left: "calc(50% + 5px)",
        },
    },
}
