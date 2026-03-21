"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"

import { gtAlpina, neueMontrealThin } from "@/app/fonts/fonts"
import HamburgerButton from "./Hamburger"

const NAV_LINKS = [
    { href: "/about", label: "ABOUT" },
    { href: "/blogs", label: "BLOGS" },
]

function NavLink({ href, label, isActive }) {
    return (
        <Link href={href} className="relative py-1 group no-underline">
            <span
                className={`text-[0.85rem] tracking-[0.2em] transition-colors duration-300 ${
                    isActive
                        ? "text-on-surface"
                        : "text-on-surface/50 group-hover:text-on-surface"
                }`}
            >
                {label}
            </span>
            {isActive && (
                <motion.div
                    className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-accent rounded-full"
                    layoutId="nav-underline"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
            )}
            {!isActive && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            )}
        </Link>
    )
}

function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset"
    }, [mobileMenuOpen])

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev)
    }

    const mobileContainerVariants = {
        closed: {
            transition: { staggerChildren: 0.04, staggerDirection: -1 },
        },
        open: {
            transition: { staggerChildren: 0.08, delayChildren: 0.15 },
        },
    }

    const mobileItemVariants = {
        closed: { opacity: 0, y: 30 },
        open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
    }

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <div
                    className={`
                        mx-auto flex items-center justify-between pointer-events-auto
                        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${
                            scrolled
                                ? "mt-3 mx-3 lg:mx-auto lg:max-w-4xl bg-white/70 backdrop-blur-2xl lg:rounded-full rounded-2xl px-6 lg:px-10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-white/60"
                                : "mt-0 mx-0 max-w-full bg-transparent px-8 lg:px-28 py-5 border border-transparent"
                        }
                    `}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="no-underline z-50 flex items-baseline"
                    >
                        <span
                            className={`${neueMontrealThin.className} text-on-surface tracking-wider transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                scrolled ? "text-xl" : "text-[2.5rem]"
                            }`}
                        >
                            EIK
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-accent ml-0.5 mb-1 flex-shrink-0" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.href}
                                href={link.href}
                                label={link.label}
                                isActive={pathname === link.href}
                            />
                        ))}
                        <div className="w-px h-4 bg-on-surface/10" />
                        <motion.a
                            href="https://drive.google.com/file/d/1TdSomZpwzSI3LxKc531xYiV5G5TGeklU/view"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[0.8rem] tracking-[0.15em] text-on-surface no-underline border border-on-surface/15 group"
                            whileHover="hover"
                            whileTap={{ scale: 0.97 }}
                        >
                            <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-300 group-hover:text-on-accent">
                                RESUME{" "}
                                <ArrowUpRight
                                    size={14}
                                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-on-surface rounded-full origin-left"
                                initial={{ scaleX: 0 }}
                                variants={{ hover: { scaleX: 1 } }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                            />
                        </motion.a>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="lg:hidden block relative z-50">
                        <HamburgerButton
                            isOpen={mobileMenuOpen}
                            toggleMenu={toggleMobileMenu}
                        />
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 bg-surface z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Decorative accent lines */}
                        <motion.div
                            className="absolute top-[18%] left-8 w-10 h-px bg-accent origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                                delay: 0.3,
                                duration: 0.6,
                                ease: "easeOut",
                            }}
                        />
                        <motion.div
                            className="absolute bottom-[18%] right-8 w-10 h-px bg-accent origin-right"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                                delay: 0.5,
                                duration: 0.6,
                                ease: "easeOut",
                            }}
                        />

                        <motion.div
                            className="flex flex-col items-center justify-center h-full gap-8"
                            variants={mobileContainerVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            {[{ href: "/", label: "HOME" }, ...NAV_LINKS].map(
                                (link, index) => (
                                    <motion.div
                                        key={link.href}
                                        variants={mobileItemVariants}
                                        className="flex items-baseline gap-4"
                                    >
                                        <span className="text-muted-light text-xs tracking-[0.3em]">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <Link
                                            href={link.href}
                                            className={`${gtAlpina.className} text-5xl tracking-tight no-underline transition-colors duration-300 ${
                                                pathname === link.href
                                                    ? "text-accent"
                                                    : "text-on-surface hover:text-accent"
                                            }`}
                                            onClick={toggleMobileMenu}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ),
                            )}
                            <motion.div
                                variants={mobileItemVariants}
                                className="mt-4"
                            >
                                <motion.a
                                    href="https://drive.google.com/file/d/1TdSomZpwzSI3LxKc531xYiV5G5TGeklU/view"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-full text-base tracking-[0.15em] text-on-surface no-underline border border-on-surface/20 group"
                                    whileHover="hover"
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-on-accent">
                                        RESUME <ArrowUpRight size={18} />
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-on-surface rounded-full origin-left"
                                        initial={{ scaleX: 0 }}
                                        variants={{ hover: { scaleX: 1 } }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeInOut",
                                        }}
                                    />
                                </motion.a>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar
