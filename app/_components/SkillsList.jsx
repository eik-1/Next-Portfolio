"use client"

import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import React, { useEffect, useRef } from "react"

import { gtAlpina } from "@/app/fonts/fonts"

gsap.registerPlugin(ScrollTrigger)

const SkillsList = ({ skills }) => {
    const componentRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: componentRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 4,
                },
            })

            tl.fromTo(
                ".skillRow",
                {
                    x: (index) =>
                        index % 2 === 0
                            ? gsap.utils.random(600, 400)
                            : gsap.utils.random(-600, -400),
                },
                {
                    x: (index) =>
                        index % 2 === 0
                            ? gsap.utils.random(-600, -400)
                            : gsap.utils.random(600, 400),
                    ease: "power1.inOut",
                },
            )
        }, componentRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={componentRef}
            className="lg:min-h-screen overflow-hidden pb-12 lg:pt-0 lg:pb-20 lg:px-28 md:pb-12"
        >
            <div className="max-w-[600px] lg:max-w-full">
                <motion.h1
                    className={`${gtAlpina.className} lg:text-[8rem] tracking-normal font-thin lg:mb-20 mb-12 lg:text-left md:text-[5.5rem] text-center pl-0 text-[5rem]`}
                    initial={{ x: 100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span>Techstack</span>
                </motion.h1>
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className="skillRow lg:mb-0 lg:mt-8 lg:min-h-[100px] min-h-[80px] flex items-center justify-center relative text-black/30"
                        aria-label={skill.name}
                    >
                        {Array.from({ length: 15 }, (_, i) => (
                            <React.Fragment key={i}>
                                <span
                                    className="lg:text-[6rem] font-semibold uppercase tracking-[0.01em] mx-4 md:text-4xl text-[3rem]"
                                    style={{
                                        color:
                                            i === 7 ? skill.color : "inherit",
                                        opacity: i === 7 ? 1 : 0.4,
                                    }}
                                >
                                    {skill.name}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default SkillsList
