import { ArrowUpRight, Globe, LockKeyhole } from "lucide-react"

import { geist, neueMontrealThin } from "@/app/fonts/fonts"
import { projects } from "@/app/utils/projects"
import Chainlink from "@/public/Chainlink.svg"
import viem from "@/public/viem.png"
import Image from "next/image"
import Link from "next/link"

export function generateStaticParams() {
    return projects.map((project) => ({
        projectId: project.title.toLowerCase().replace(/ /g, "%20"),
    }))
}

export const revalidate = 604800

export default function ProjectPage({ params }) {
    const title = params.projectId
    const project = projects.find(
        (p) =>
            p.title.toLowerCase() === title.toLowerCase().replace(/%20/g, " "),
    )

    // if (!project) {
    //     return <div className={styles.notFound}>Project not found</div>
    // }

    return (
        <div className="max-w-[1200px] min-h-screen mx-auto lg:mt-24 lg:mb-20 mt-28 mb-12 p-4">
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
                        className={`lg:text-2xl text-xl mb-4 antialiased ${neueMontrealThin.className} font-extrabold tracking-wide`}
                    >
                        {project.des}
                    </p>
                    <hr className="border-0 h-px bg-gray-400 my-5" />
                    <div className="w-fit rounded-[50px] flex lg:flex-nowrap flex-wrap justify-center gap-4 mb-12 relative">
                        {project.chainlink && (
                            <div className="relative inline-block group">
                                <Image
                                    src={Chainlink}
                                    alt="Chainlink"
                                    className="w-6 h-6"
                                />
                                <span className="invisible bg-black text-gray-200 text-center rounded-md px-2 py-1 absolute z-1 bottom-[125%] left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300 text-sm whitespace-nowrap group-hover:visible group-hover:opacity-100">
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
                                <span className="invisible bg-black text-gray-200 text-center rounded-md px-2 py-1 absolute z-1 bottom-[125%] left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300 text-sm whitespace-nowrap group-hover:visible group-hover:opacity-100">
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
                                <span className="invisible bg-black text-gray-200 text-center rounded-md px-2 py-1 absolute z-1 bottom-[125%] left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300 text-sm whitespace-nowrap group-hover:visible group-hover:opacity-100">
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
                            className="py-2 px-4 flex gap-1 items-center tracking-wide bg-black text-gray-200 no-underline rounded transition-colors duration-300 hover:bg-red-500 justify-center"
                        >
                            LIVE <ArrowUpRight size={24} />
                        </Link>
                        {project.github.isPrivate ? (
                            <button
                                disabled
                                className="py-2 px-4 flex gap-2 items-center tracking-wide  text-black border border-black rounded justify-center"
                            >
                                GITHUB <LockKeyhole size={18} />
                            </button>
                        ) : (
                            <Link
                                href={project.github.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2 px-4 flex gap-1 items-center tracking-wide border border-black bg-transparent text-black no-underline rounded transition-colors duration-300 justify-center hover:border-red-500"
                            >
                                GITHUB <Globe size={22} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-0 h-px bg-gray-400 my-5" />
            <div className={`mt-8 antialiased ${geist.variable}`}>
                <p className="lg:text-2xl text-lg leading-6 mb-4">
                    {project.paragraph1}
                </p>
                <p className="lg:text-2xl text-lg leading-6 mb-4">
                    {project.paragraph2}
                </p>
            </div>
        </div>
    )
}
