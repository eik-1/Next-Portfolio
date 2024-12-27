"use client"

import { AnimatePresence, motion } from "framer-motion"
import localFont from "next/font/local"
import Link from "next/link"
import React, { useEffect, useState } from "react"

import HamburgerButton from "./Hamburger"
import ResumeButton from "./ResumeButton"

const neueMontrealThin = localFont({
    src: "../fonts/PPNeueMontreal-Thin.otf",
})

function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset"
    }, [mobileMenuOpen])

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prevState) => !prevState)
    }

    const menuVariants = {
        closed: {
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
            },
        },
        open: {
            x: "0%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
            },
        },
    }

    return (
        <>
            <nav
                className={`flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-all ${
                    scrolled ? " backdrop-blur-lg shadow-lg" : "bg-transparent"
                } lg:py-3 lg:px-28 pr-1 pl-8  md:z-100`}
            >
                <div>
                    <Link
                        href="/"
                        className={`${neueMontrealThin.className} text-black tracking-wider text-[2.5rem] font-bold no-underline z-50`}
                    >
                        <h1>EIK</h1>
                    </Link>
                </div>
                <div className="hidden lg:flex items-center gap-8">
                    <Link
                        href="/about"
                        className="text-black text-2xl transition-colors duration-500 hover:text-red-500"
                    >
                        ABOUT
                    </Link>
                    <Link
                        href="/blogs"
                        className="text-black text-2xl transition-colors duration-500 hover:text-red-500"
                    >
                        BLOGS
                    </Link>
                    <ResumeButton
                        href="https://drive.google.com/file/d/1yivpQlXRbVlX28Qpk9_fIm-YERRxlfYc/view?usp=sharing"
                        buttonStyle="relative inline-block px-5 py-[10px] border border-black cursor-pointer overflow-hidden transition-colors duration-300 text-black hover:text-gray-100"
                    />
                </div>
                <div className="lg:hidden block relative z-50">
                    <HamburgerButton
                        isOpen={mobileMenuOpen}
                        toggleMenu={toggleMobileMenu}
                    />
                </div>
            </nav>
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="flex fixed top-0 right-0 bottom-0 w-full bg-gray-100 z-40"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <div className="flex flex-col items-center justify-center w-full h-full space-y-8">
                            <Link
                                href="/"
                                className="text-black text-3xl no-underline"
                                onClick={toggleMobileMenu}
                            >
                                HOME
                            </Link>
                            <Link
                                href="/about"
                                className="text-black text-3xl no-underline"
                                onClick={toggleMobileMenu}
                            >
                                ABOUT
                            </Link>
                            <Link
                                href="/blogs"
                                className="text-black text-3xl no-underline"
                                onClick={toggleMobileMenu}
                            >
                                BLOGS
                            </Link>
                            <ResumeButton
                                href="https://drive.google.com/file/d/1yivpQlXRbVlX28Qpk9_fIm-YERRxlfYc/view?usp=sharing"
                                buttonStyle="relative inline-block px-5 py-3 border border-black cursor-pointer text-black overflow-hidden transition-colors duration-300 hover:text-gray-300"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar
