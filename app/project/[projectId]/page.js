import { ArrowUpRight, Globe, LockKeyhole } from "lucide-react"

import { geist, neueMontrealThin } from "@/app/fonts/fonts"
import { projects } from "@/app/utils/projects"
import Chainlink from "@/public/Chainlink.svg"
import viem from "@/public/viem.png"
import Image from "next/image"
import Link from "next/link"

export function generateStaticParams() {
    return projects.map((project) => ({
        projectId: project.title.toLowerCase().replace(/ /g, "-"),
    }))
}

export const revalidate = 604800

export default function ProjectPage({ params }) {
    const title = params.projectId
    const project = projects.find(
        (p) => p.title.toLowerCase() === title.toLowerCase().replace(/-/g, " "),
    )

    return (
        <div className="max-w-[1200px] min-h-screen mx-auto pt-28 lg:pt-24 pb-12 lg:pb-20 px-8 lg:px-12">
            <div className="flex lg:flex-row flex-col lg:gap-12 gap-6 mb-8">
                <Image
                    src={project.img}
                    alt={project.title}
                    quality={80}
                    className="lg:w-1/2 w-full object-cover rounded-xl shadow-md"
                />
                <div className="lg:w-1/2 w-full mt-4">
                    <h1
                        className={`lg:text-7xl text-5xl mb-4 antialiased ${neueMontrealThin.className}`}
                    >
                        {project.title}
                    </h1>
                    <p
                        className="lg:text-2xl text-xl mb-4 antialiased tracking-wide"
                    >
                        {project.des}
                    </p>
                    <hr className="border-0 h-px bg-border my-5" />
                    <div className="w-fit rounded-[50px] flex lg:flex-nowrap flex-wrap justify-center gap-4 mb-12 relative">
                        {project.chainlink && (
                            <div className="relative inline-block group">
                                <Image
                                    src={Chainlink}
                                    alt="Chainlink"
                                    className="w-6 h-6"
                                />
                                <span className="invisible bg-tooltip-bg text-tooltip-text text-center rounded-md px-2 py-1 absolute z-10 bottom-[125%] left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300 text-sm whitespace-nowrap group-hover:visible group-hover:opacity-100">
                                    Chainlink
                                </span>
                            </div>
                        )}
                        {project.viem && (
                            <div className="relative inline-block group">
                                <Image
                                    src={viem}
                                    alt="Viem"
                                    className="w-6 h-6"
                                />
                                <span className="invisible bg-tooltip-bg text-tooltip-text text-center rounded-md px-2 py-1 absolute z-10 bottom-[125%] left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300 text-sm whitespace-nowrap group-hover:visible group-hover:opacity-100">
                                    Viem
                                </span>
                            </div>
                        )}
                        {project.iconLists.map(({ Icon, name }, index) => (
                            <div
                                key={index}
                                className="relative inline-block group"
                            >
                                <Icon size={24} />
                                <span className="invisible bg-tooltip-bg text-tooltip-text text-center rounded-md px-2 py-1 absolute z-10 bottom-[125%] left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300 text-sm whitespace-nowrap group-hover:visible group-hover:opacity-100">
                                    {name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex lg:flex-row flex-col gap-4">
                        <Link
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-4 flex gap-1 items-center tracking-wide bg-on-surface text-tooltip-text no-underline rounded transition-colors duration-300 hover:bg-accent justify-center"
                        >
                            LIVE <ArrowUpRight size={24} />
                        </Link>
                        {project.github.isPrivate ? (
                            <button
                                disabled
                                className="py-2 px-4 flex gap-2 items-center tracking-wide text-muted border border-border rounded justify-center cursor-not-allowed opacity-60"
                            >
                                GITHUB <LockKeyhole size={18} />
                            </button>
                        ) : (
                            <Link
                                href={project.github.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2 px-4 flex gap-1 items-center tracking-wide border border-on-surface bg-transparent text-on-surface no-underline rounded transition-colors duration-300 justify-center hover:border-accent hover:text-accent"
                            >
                                GITHUB <Globe size={22} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-0 h-px bg-border my-5" />
            <div className={`mt-8 antialiased ${geist.className}`}>
                <p className="lg:text-2xl text-lg leading-7 lg:leading-8 mb-4 text-on-surface">
                    {project.paragraph1}
                </p>
                <p className="lg:text-2xl text-lg leading-7 lg:leading-8 mb-4 text-on-surface">
                    {project.paragraph2}
                </p>
            </div>
        </div>
    )
}
