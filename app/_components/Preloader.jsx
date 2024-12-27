import { AnimatePresence, motion } from "framer-motion"
import React from "react"
import { neueMontrealThin } from "../fonts/fonts"

function Preloader() {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-black z-9999"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.p
                    className={`${neueMontrealThin.className} mt-5 text-5xl text-gray-100`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    Eik
                </motion.p>
            </motion.div>
        </AnimatePresence>
    )
}

export default Preloader
