"use client"

import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { motion } from "framer-motion"
import { Linkedin } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import React, { Suspense, useEffect, useState } from "react"

import { gtAlpina, neueMontrealThin } from "@/app/fonts/fonts.js"
import wavingHand from "@/public/apple_waving.png"
import medium from "@/public/medium.svg"
import X from "@/public/x.svg"
import ShinyButton from "./magicui/ShinyButton"

const Ethereum = dynamic(() => import("@/public/Ethereum"), {
    ssr: false,
    loading: () => null,
    // Lower priority means it won't block other resources
    priority: false,
})

function Hero() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    const fadeInFromBottom = {
        hidden: {
            opacity: 0,
            y: 50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2,
            },
        },
    }

    return (
        <section className="flex items-center justify-between min-h-screen p-8 mt-8 lg:px-28 relative overflow-hidden">
            <div className="absolute rounded-full filter blur-[60px] opacity-50 z-[-1] w-[550px] h-[500px] bg-gradient-to-r from-red-500 to-transparent bottom-15 right-[2rem] hidden lg:block"></div>
            <div className="flex items-center justify-between w-full flex-col lg:flex-row text-center lg:text-left">
                <div
                    className={`flex flex-col justify-center flex-1 gap-6 lg:pr-8 text-black antialiased ${neueMontrealThin.className}`}
                >
                    <motion.div
                        className="text-5xl lg:text-[9rem] font-semibold flex items-center justify-center lg:justify-start gap-8 tracking-tight"
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                        variants={fadeInFromBottom}
                    >
                        <Image
                            className="w-16 h-16 lg:w-24 lg:h-24"
                            src={wavingHand}
                            alt="waving hand"
                            width={100}
                            height={100}
                            quality={100}
                            placeholder="blur"
                        />
                        <h1>
                            Hi, I&apos;m{" "}
                            <span
                                className={`${gtAlpina.className} antialiased lg:text-[9rem] text-6xl tracking-[1px] font-light relative`}
                            >
                                Eik
                                <span
                                    className="absolute w-full border-t-4 border-red-500 left-0 bottom-[3px] rounded-full h-3"
                                    style={{ borderRadius: "100% 100% 0 0" }}
                                ></span>
                            </span>
                        </h1>
                    </motion.div>

                    <p
                        className={`text-xl ${neueMontrealThin.className} md:text-4xl leading-relaxed font-extrabold md:leading-normal`}
                    >
                        I&apos;m a full-stack{" "}
                        <span className="transition-colors duration-300 ease-in-out text-gray-100 bg-red-500 bg-opacity-90 px-2">
                            Web3
                        </span>{" "}
                        developer based in India.
                        <br />I believe in{" "}
                        <span className="transition-colors duration-300 ease-in-out text-gray-100 bg-red-500 bg-opacity-90 px-2">
                            Blockchain
                        </span>
                        .
                    </p>
                    <div className="flex items-center gap-4 mt-4 flex-col lg:flex-row">
                        <ShinyButton
                            text="Visit My GitHub"
                            githubUrl="https://github.com/eik-1"
                        />
                        <div className="flex gap-2 mt-0">
                            <Link
                                href="https://x.com/0xeik"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 text-black"
                            >
                                <Image className="w-5 h-5" src={X} alt="X" />
                            </Link>
                            <Link
                                href="https://www.linkedin.com/in/sarthakeik1/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 text-black"
                            >
                                <Linkedin size={24} />
                            </Link>
                            <Link
                                href="https://medium.com/@sarthakrawatbiz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 text-black"
                            >
                                <Image
                                    className="w-7.5 h-7.5"
                                    src={medium}
                                    alt="medium"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-2/5 h-[600px] bg-transparent hidden lg:block">
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
                </div>
            </div>
        </section>
    )
}

export default Hero
