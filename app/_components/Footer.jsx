import { gtAlpina } from "@/app/fonts/fonts"
import Link from "next/link"

function Footer() {
    const currentYear = new Date().getFullYear()
    return (
        <footer className="flex w-full flex-col gap-4 md:flex-row items-center justify-between px-8 lg:px-28 py-8 z-20 transition-colors duration-300 ease-in-out">
            <p className="text-on-surface text-lg font-bold no-underline">
                &copy; {currentYear} | Eik
            </p>
            <div className="text-center md:text-right">
                <h3
                    className={`${gtAlpina.className} text-on-surface text-3xl md:text-4xl mb-1 inline-block relative pb-0.5 after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-300 ease-in-out hover:after:scale-x-100`}
                >
                    Get in touch
                </h3>
                <div className="flex justify-center items-center md:justify-end gap-0">
                    <Link
                        href="https://x.com/0xeik"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface no-underline text-sm transition-colors duration-300 hover:text-accent"
                    >
                        X
                    </Link>
                    <span className="text-muted-light mx-2 text-sm">/</span>
                    <Link
                        href="https://www.linkedin.com/in/sarthakeik1/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface no-underline text-sm transition-colors duration-300 hover:text-accent"
                    >
                        LinkedIn
                    </Link>
                    <span className="text-muted-light mx-2 text-sm">/</span>
                    <Link
                        href="https://github.com/eik-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface no-underline text-sm transition-colors duration-300 hover:text-accent"
                    >
                        Github
                    </Link>
                    <span className="text-muted-light mx-2 text-sm">/</span>
                    <Link
                        href="https://warpcast.com/0xeik.eth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface no-underline text-sm transition-colors duration-300 hover:text-accent"
                    >
                        Warpcast
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer
