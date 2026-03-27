"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { gtAlpina } from "@/app/fonts/fonts"
import { projects } from "@/app/utils/projects"
import Image from "next/image"

function ProjectCard({ project }) {
    const [isHovered, setIsHovered] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        setMousePosition({
            x: e.clientX + 20,
            y: e.clientY + 20,
        })
    }

    return (
        <div className="projectCard group">
            <motion.div
                className="relative rounded-2xl overflow-hidden aspect-[5/3] shadow-lg border border-accent/10 hover:border-accent/25 transition-colors duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
            >
                <Link
                    href={`project/${project.title
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                >
                    <Image
                        src={project.img}
                        alt={project.title}
                        quality={80}
                        className="projectImage w-full h-full cursor-pointer object-cover transition-transform duration-300 ease-in-out
                        group-hover:scale-105"
                    />
                    {isHovered && (
                        <motion.div
                            className="fixed bg-inherit backdrop-blur-md text-on-surface py-2 px-4 rounded-full font-bold transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 ease-in-out z-50"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                left: mousePosition.x,
                                top: mousePosition.y,
                            }}
                        >
                            <div className="flex items-center justify-center gap-1">
                                EXPLORE
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </motion.div>
                    )}
                </Link>
            </motion.div>
            <div className="pt-3 bg-transparent text-on-surface">
                <h2 className="text-xl font-bold">{project.title}</h2>
                <p className="text-sm text-muted mt-1">{project.des}</p>
            </div>
        </div>
    )
}

function Projects() {
    const { scrollYProgress } = useScroll()
    const backgroundColor = useTransform(
        scrollYProgress,
        [0, 0.1, 0.2],
        ["rgb(237, 238, 242)", "rgb(237, 238, 242)", "rgb(237, 238, 242)"],
    )
    const opacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1])

    return (
        <motion.div className="lg:min-h-screen overflow-hidden pb-20 lg:pt-0 lg:pb-20 px-8 lg:px-28">
            <motion.h1
                className={`${gtAlpina.className} lg:text-[8rem] tracking-normal font-thin lg:mb-20 mb-12 lg:text-left md:text-[5.5rem] text-center text-[5rem]`}
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <span>Projects</span>
            </motion.h1>
            <motion.div
                className="grid lg:grid-cols-2 grid-cols-1 lg:gap-20 gap-10"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </motion.div>
        </motion.div>
    )
}

export default Projects
