"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const ResumeButton = ({ href, buttonStyle }) => {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyle}
            whileHover="hover"
            whileTap="tap"
            variants={{
                tap: { scale: 0.95 },
            }}
        >
            <motion.span className="flex items-center justify-center gap-2 relative z-10">
                RESUME <ArrowUpRight />
            </motion.span>
            <motion.div
                className="absolute top-0 left-0 w-full h-full bg-on-surface origin-left"
                initial={{ scaleX: 0 }}
                variants={{
                    hover: { scaleX: 1 },
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.a>
    )
}

export default ResumeButton
