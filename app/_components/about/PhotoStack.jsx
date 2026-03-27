"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

import myPic1 from "@/public/mypic.webp"
import myPic2 from "@/public/mypic2.jpeg"

const photos = [myPic1, myPic2]

const rotations = [-3, 4, -5, 6]
const offsets = [
    { x: 0, y: 0 },
    { x: 14, y: -8 },
    { x: -10, y: 6 },
    { x: 18, y: -12 },
]

export default function PhotoStack() {
    const [activeIndex, setActiveIndex] = useState(0)

    const cycle = () => {
        setActiveIndex((prev) => (prev + 1) % photos.length)
    }

    return (
        <div
            className="relative w-[200px] h-[260px] lg:w-[250px] lg:h-[320px] cursor-pointer select-none"
            onClick={cycle}
        >
            {photos.map((src, i) => {
                const isFront = i === activeIndex
                const stackPos = (i - activeIndex + photos.length) % photos.length

                return (
                    <motion.div
                        key={i}
                        className="absolute inset-0 bg-white rounded-sm shadow-xl"
                        style={{ padding: "10px 10px 40px 10px" }}
                        animate={{
                            rotate: isFront
                                ? rotations[0]
                                : rotations[stackPos] || rotations[1],
                            scale: isFront ? 1 : 0.95 - stackPos * 0.02,
                            x: isFront
                                ? 0
                                : offsets[stackPos]?.x || 12,
                            y: isFront
                                ? 0
                                : offsets[stackPos]?.y || -6,
                            zIndex: photos.length - stackPos,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 22,
                        }}
                        whileHover={isFront ? { rotate: -1, scale: 1.02 } : {}}
                    >
                        <Image
                            src={src}
                            alt={`Photo ${i + 1}`}
                            className="w-full h-full object-cover rounded-[2px]"
                            width={250}
                            height={320}
                            quality={85}
                        />
                    </motion.div>
                )
            })}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.2em] text-on-surface/30 uppercase">
                Click to flip
            </span>
        </div>
    )
}
