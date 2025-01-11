import { gtAlpina } from "@/app/fonts/fonts"
import Link from "next/link"

export const revalidate = 36000

function Footer() {
    const currentYear = new Date().getFullYear()
    return (
        <footer className="flex w-full flex-col gap-4 md:flex-row items-center justify-between p-3 md:p-8 md:px-28 z-20 transition-colors duration-300 ease-in-out pb-8">
            <p className="text-black font-neueMontreal text-lg font-bold no-underline mb-0.5 md:mr-1">
                &copy; {currentYear} | Eik
            </p>
            <div className="text-center max-w-xs md:text-right">
                <h3
                    className={`${gtAlpina.className} text-black text-3xl md:text-4xl mb-0.5 inline-block relative pb-0.5 after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-red-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 ease-in-out hover:after:scale-x-100`}
                >
                    Get in touch
                </h3>
                <div className="flex justify-end items-center md:justify-end">
                    <Link
                        href="https://x.com/0xeik"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black no-underline text-sm hover:text-red-500"
                    >
                        X
                    </Link>
                    <span className="text-black mx-2 text-sm">/</span>
                    <Link
                        href="https://www.linkedin.com/in/sarthakeik1/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black no-underline text-sm hover:text-red-500"
                    >
                        LinkedIn
                    </Link>
                    <span className="text-black mx-2 text-sm">/</span>
                    <Link
                        href="https://github.com/eik-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black no-underline text-sm hover:text-red-500"
                    >
                        Github
                    </Link>
                    <span className="text-black mx-2 text-sm">/</span>
                    <Link
                        href="https://warpcast.com/0xeik.eth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black no-underline text-sm hover:text-red-500"
                    >
                        Warpcast
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer
