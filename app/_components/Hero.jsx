"use client"

import { motion } from "framer-motion"
import { Linkedin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"

// Commented out: 3D Ethereum model
// import { Environment, OrbitControls } from "@react-three/drei"
// import { Canvas } from "@react-three/fiber"
// import dynamic from "next/dynamic"
// import { Suspense } from "react"
// const Ethereum = dynamic(() => import("@/public/Ethereum"), {
//     ssr: false,
//     loading: () => null,
//     priority: false,
// })

import { gtAlpina } from "@/app/fonts/fonts.js"
import medium from "@/public/medium.svg"
import myPic from "@/public/mypic2.jpeg"
import X from "@/public/x.svg"
import ShinyButton from "./magicui/ShinyButton"

const MARQUEE_ITEMS = [
    "SOLIDITY",
    "TYPESCRIPT",
    "RUST",
    "REACT",
    "NEXT.JS",
    "FOUNDRY",
    "VIEM",
    "EXPRESS",
    "POSTGRESQL",
    "REDIS",
    "AWS",
    "CLOUDFLARE",
    "DOCKER",
    "SUPABASE",
    "HARDHAT",
]

function Hero() {
    const [isVisible, setIsVisible] = useState(false)
    const [time, setTime] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const update = () => {
            setTime(
                new Date().toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })
            )
        }
        update()
        const interval = setInterval(update, 60000)
        return () => clearInterval(interval)
    }, [])

    const stagger = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.15, delayChildren: 0.1 },
        },
    }

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
        },
    }

    const marqueeContent = MARQUEE_ITEMS.map((item, i) => (
        <span
            key={i}
            className="flex-shrink-0 text-[0.7rem] tracking-[0.25em] text-on-surface/25 uppercase whitespace-nowrap"
        >
            {item}
            <span className="text-accent/40 mx-5">·</span>
        </span>
    ))

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
            {/* === Content === */}
            <motion.div
                className="relative z-10 w-full"
                variants={stagger}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
            >
                {/* === Photo + Name + Role === */}
                <motion.div
                    className="flex flex-col items-center lg:items-center lg:flex-row gap-6 lg:gap-10 px-8 lg:px-28"
                    variants={fadeUp}
                >
                    {/* Photo */}
                    <div className="relative flex-shrink-0">
                        <div className="rounded-full p-[3px] bg-gradient-to-br from-accent/40 via-accent/10 to-transparent">
                            <Image
                                src={myPic}
                                alt="Eik"
                                className="w-24 h-24 lg:w-[130px] lg:h-[130px] rounded-full object-cover border-[3px] border-surface"
                                width={130}
                                height={130}
                                quality={90}
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <h1 className="flex-shrink-0 text-center lg:text-left" style={{ fontSize: "clamp(3.5rem, 13vw, 13rem)" }}>
                        <span
                            className={`${gtAlpina.className} text-[1em] leading-[0.88] tracking-tight text-on-surface relative inline-block`}
                        >
                            Eik
                            <span
                                className="absolute w-full border-t-[0.025em] border-accent left-0 bottom-[0.05em] h-[0.06em]"
                                style={{ borderRadius: "100% 100% 0 0" }}
                            />
                        </span>
                        <span className="inline-block w-[0.1em] h-[0.1em] rounded-full bg-accent relative bottom-[0.05em] ml-[0.02em]" />
                    </h1>

                    {/* Role descriptor — desktop */}
                    <div className="hidden lg:flex flex-col items-end gap-0.5 ml-auto pb-6">
                        {["FULL-STACK", "SOFTWARE", "ENGINEER"].map(
                            (word, i) => (
                                <motion.span
                                    key={word}
                                    className={`text-sm tracking-[0.3em] ${
                                        i === 0
                                            ? "text-accent"
                                            : "text-on-surface/40"
                                    }`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={
                                        isVisible
                                            ? { opacity: 1, x: 0 }
                                            : { opacity: 0, x: 20 }
                                    }
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.25, 0.1, 0.25, 1],
                                        delay: 0.6 + i * 0.1,
                                    }}
                                >
                                    {word}
                                </motion.span>
                            ),
                        )}
                    </div>
                </motion.div>

                {/* === Skill Marquee — full viewport width, seamless loop === */}
                <motion.div
                    className="overflow-hidden border-y border-on-surface/[0.06] py-3 my-6 lg:my-8"
                    variants={fadeUp}
                >
                    <div className="flex w-max animate-marquee">
                        <div className="flex">{marqueeContent}</div>
                        <div className="flex">{marqueeContent}</div>
                    </div>
                </motion.div>

                {/* === Bottom: Status/Bio + CTA/Socials/Time === */}
                <motion.div
                    className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 px-8 lg:px-28"
                    variants={fadeUp}
                >
                    <div>
                        {/* Mobile role label */}
                        <p className="lg:hidden text-xs tracking-[0.25em] text-accent mb-2">
                            FULL-STACK SOFTWARE ENGINEER
                        </p>
                        {/* Availability */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[0.65rem] tracking-[0.25em] text-on-surface/40 uppercase">
                                Available for work
                            </span>
                        </div>
                        <p className="text-base lg:text-lg leading-relaxed max-w-md text-on-surface/60">
                            Full-stack software engineer based in India,
                            specializing in{" "}
                            <span className="text-on-accent bg-accent/90 px-1.5">
                                Blockchain
                            </span>{" "}
                            and decentralized applications.
                        </p>
                    </div>

                    <div className="flex flex-col lg:items-end gap-4 flex-shrink-0">
                        <div className="flex items-center gap-5 flex-col sm:flex-row">
                            <ShinyButton
                                text="Visit My GitHub"
                                githubUrl="https://github.com/eik-1"
                            />
                            <div className="flex gap-3">
                                <Link
                                    href="https://x.com/0xeik"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 text-on-surface transition-colors duration-300 hover:text-accent"
                                >
                                    <Image
                                        className="w-5 h-5"
                                        src={X}
                                        alt="X"
                                    />
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/in/sarthakeik1/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 text-on-surface transition-colors duration-300 hover:text-accent"
                                >
                                    <Linkedin size={24} />
                                </Link>
                                <Link
                                    href="https://medium.com/@sarthakrawatbiz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 text-on-surface transition-colors duration-300 hover:text-accent"
                                >
                                    <Image
                                        className="w-7 h-7"
                                        src={medium}
                                        alt="medium"
                                    />
                                </Link>
                            </div>
                        </div>
                        {/* Location + Live Time */}
                        {time && (
                            <span className="text-[0.65rem] tracking-[0.25em] text-on-surface/30 uppercase">
                                India · IST {time}
                            </span>
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* Commented out: Ethereum 3D Model */}
            {/* <div className="w-full lg:w-2/5 h-[600px] bg-transparent hidden lg:block">
                <Canvas>
                    <ambientLight />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={true}
                        enableDamping={true}
                        dampingFactor={0.25}
                        rotateSpeed={0.5}
                    />
                    <Suspense fallback={null}>
                        <Ethereum />
                    </Suspense>
                    <Environment preset="sunset" />
                </Canvas>
            </div> */}
        </section>
    )
}

export default Hero
