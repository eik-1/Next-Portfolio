import { motion } from "framer-motion"
import { ChevronRightIcon } from "lucide-react"
import localFont from "next/font/local"
import React from "react"

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

const neueMontreal = localFont({
    src: "../../fonts/PPNeueMontreal-Medium.otf",
    display: "swap",
})

const ShinyButton = ({ text = "shiny-button", githubUrl }) => {
    const handleClick = () => {
        window.open(githubUrl, "_blank", "noopener,noreferrer")
    }
    return (
        <motion.button
            {...animationProps}
            onClick={handleClick}
            className="relative rounded-lg px-6 py-2 font-bold backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out hover:shadow"
            style={{
                "--primary": "220 90% 56%",
                backgroundColor: "#000",
            }}
        >
            <span
                className={`${neueMontreal.className} antialiased tracking-wide relative flex items-center justify-center h-full w-full text-sm uppercase text-gray-100`}
                style={{
                    maskImage:
                        "linear-gradient(-75deg, #fff calc(var(--x) + 30%), transparent calc(var(--x) + 30%), #fff calc(var(--x) + 100%))",
                }}
            >
                {text} <ChevronRightIcon size={18} className="ml-1" />
            </span>
            <span
                style={{
                    mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                    maskComposite: "exclude",
                }}
                className="absolute inset-0 z-1 block rounded-[inherit] p-px"
            >
                <span
                    className="absolute inset-0 rounded-[inherit]"
                    style={{
                        background:
                            "linear-gradient(-75deg, rgba(255,255,255,0.1) calc(var(--x) + 20%), rgba(255,255,255,0.7) calc(var(--x) + 25%), rgba(255,255,255,0.1) calc(var(--x) + 100%))",
                    }}
                />
            </span>
        </motion.button>
    )
}

export default ShinyButton
