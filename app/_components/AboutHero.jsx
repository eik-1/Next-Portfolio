"use client"

import { motion } from "framer-motion"

import { gtAlpina, neueMontrealThin } from "@/app/fonts/fonts"
import PhotoStack from "./about/PhotoStack"

const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
}

function AboutHero() {
    return (
        <motion.section
            className="flex flex-col lg:flex-row gap-10 lg:gap-28 items-center lg:items-start pt-28 lg:pt-32 pb-20 lg:pb-24 px-8 lg:px-28"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                visible: {
                    transition: { staggerChildren: 0.15 },
                },
            }}
        >
            <motion.div className="flex-shrink-0" variants={fadeIn}>
                <PhotoStack />
            </motion.div>

            <motion.div
                className="flex flex-col text-center lg:text-left"
                variants={fadeIn}
            >
                <h1
                    className={`${gtAlpina.className} text-5xl lg:text-7xl text-on-surface tracking-tight mb-2`}
                >
                    Sarthak Rawat
                </h1>
                <p
                    className={`${neueMontrealThin.className} text-2xl lg:text-3xl text-on-surface/50 mb-6`}
                >
                    aka{" "}
                    <span className={`${gtAlpina.className} text-accent`}>
                        Eik.
                    </span>
                </p>
                <p className="text-on-surface/60 leading-relaxed max-w-lg text-base lg:text-lg">
                    I build things that live on the blockchain and the systems
                    that power them. From smart contracts to scalable backend
                    infrastructure, I care about code that&apos;s reliable,
                    performant, and well-crafted.
                </p>
            </motion.div>
        </motion.section>
    )
}

export default AboutHero
