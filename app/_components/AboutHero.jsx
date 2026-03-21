import { ArrowRight } from "lucide-react"
import Image from "next/image"

import wavingHand from "@/public/apple_waving.png"
import { gtAlpina } from "../fonts/fonts"
import AboutImage from "./AboutImage"

function AboutHero() {
    return (
        <div className="min-h-screen pt-28 lg:pt-28 flex lg:flex-row flex-col lg:justify-around items-center px-8 lg:px-28 pb-20">
            <div className="lg:text-[3rem] lg:mt-8 flex flex-col lg:items-start items-center text-[2rem]">
                <div className="flex items-center gap-4 lg:text-[3rem] text-[2rem] lg:justify-start justify-center">
                    <Image
                        src={wavingHand}
                        alt="apple waving"
                        quality={80}
                        width={100}
                        height={100}
                        className="lg:w-12 w-10"
                    />
                    Hey, it&apos;s nice to meet you!
                </div>
                <div className="mt-4 lg:text-4xl relative inline-block text-2xl group">
                    A bit about myself...
                    <span className="absolute bottom-[2px] left-0 w-full h-0.5 bg-accent scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
                </div>
                <div className="mt-3 lg:text-xl text-muted max-w-xl text-base text-left">
                    I&apos;m Sarthak but you can call me{" "}
                    <span className={`text-accent ${gtAlpina.className}`}>
                        Eik
                    </span>
                    . I&apos;m a multidisciplinary full stack web3 developer and a
                    UI/UX designer. I&apos;m currently pursuing my Bachelors in
                    Computer Science and Engineering. I was introduced to Web3
                    when I first joined{" "}
                    <span className={`text-accent ${gtAlpina.className}`}>
                        Tech Twitter
                    </span>
                    . The idea of decentralized economy and finance motivated me
                    to self-learn about blockchain development.
                </div>
                <div className="mt-4 lg:text-4xl relative inline-block text-2xl group">
                    What I can do for you...
                    <span className="absolute bottom-[2px] left-0 w-full h-0.5 bg-accent scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
                </div>
                <div className="mt-3 lg:text-xl text-muted w-full text-base">
                    <ul className="pl-0 space-y-1">
                        <li className="flex items-center">
                            <ArrowRight
                                className="inline-block mr-2 text-accent flex-shrink-0"
                                size={20}
                            />
                            Writing Smart Contracts
                        </li>
                        <li className="flex items-center">
                            <ArrowRight
                                className="inline-block mr-2 text-accent flex-shrink-0"
                                size={20}
                            />
                            Web3 Frontend Development
                        </li>
                        <li className="flex items-center">
                            <ArrowRight
                                className="inline-block mr-2 text-accent flex-shrink-0"
                                size={20}
                            />
                            Web3 Backend Development
                        </li>
                        <li className="flex items-center">
                            <ArrowRight
                                className="inline-block mr-2 text-accent flex-shrink-0"
                                size={20}
                            />
                            UI/UX Design
                        </li>
                    </ul>
                </div>
            </div>
            <AboutImage />
        </div>
    )
}

export default AboutHero
