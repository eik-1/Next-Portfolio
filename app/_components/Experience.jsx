"use client"

import { motion } from "framer-motion"
import Image from "next/image"

import { gtAlpina } from "@/app/fonts/fonts"

const EXPERIENCES = [
    {
        role: "Full Stack Engineer",
        company: "Capx AI",
        logo: "/capx_logo.jpg",
        period: "May 2025 · Present",
        bullets: [
            "Led backend development for the Capx Super App mainnet launch, architecting core platform APIs in TypeScript/Express with Node.js clustering across trading, governance, airdrop, and affiliate domains.",
            "Managed 50+ PostgreSQL tables, 100+ SQL functions, and 10+ microservices. Architected a Supabase Postgres read replica strategy to offload 80% read traffic.",
            "Deployed Solidity smart contracts including a Uniswap V2 fork with custom fee logic, UUPS upgradeable proxies, EIP-1167 minimal proxy factories, and Governance contracts.",
            "Migrated infrastructure from AWS App Runner to Cloudflare Containers, implementing a 3-tier edge architecture. Reduced hosting costs by 60%.",
            "Built a real-time WebSocket broadcaster serving 11 data channels via AWS API Gateway with Redis caching and HMAC-SHA256 DDoS protection.",
        ],
    },
]

function ExperienceCard({ exp, index }) {
    return (
        <motion.div
            className="group border border-accent/15 rounded-2xl p-6 lg:p-10 transition-all duration-500 hover:border-accent/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
                delay: index * 0.15,
            }}
            whileHover={{ y: -3 }}
        >
            {/* Header: logo + role + date */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                            src={exp.logo}
                            alt={exp.company}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-on-surface text-xl lg:text-2xl">
                            {exp.role}
                        </h3>
                        <p
                            className={`text-accent ${gtAlpina.className} text-sm mt-0.5`}
                        >
                            {exp.company}
                        </p>
                    </div>
                </div>
                <span className="text-on-surface/30 text-xs tracking-[0.25em] uppercase">
                    {exp.period}
                </span>
            </div>

            {/* Bullet points — staggered scroll reveal, hover highlight */}
            <ul className="space-y-0">
                {exp.bullets.map((bullet, i) => (
                    <motion.li
                        key={i}
                        className="group/item flex gap-4 py-3 border-t border-on-surface/[0.05] first:border-t-0 cursor-default"
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.4,
                            ease: [0.25, 0.1, 0.25, 1],
                            delay: 0.2 + i * 0.08,
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover/item:bg-accent mt-2 flex-shrink-0 transition-colors duration-300" />
                        <p className="text-on-surface/45 group-hover/item:text-on-surface/75 text-sm lg:text-[0.95rem] leading-relaxed transition-colors duration-300">
                            {bullet}
                        </p>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    )
}

function Experience() {
    return (
        <section className="overflow-hidden pb-20 lg:pb-28 px-8 lg:px-28">
            <motion.h1
                className={`${gtAlpina.className} lg:text-[8rem] tracking-normal font-thin lg:mb-20 mb-12 lg:text-left md:text-[5.5rem] text-center text-[5rem]`}
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <span>Experience</span>
            </motion.h1>

            <div className="space-y-8">
                {EXPERIENCES.map((exp, i) => (
                    <ExperienceCard key={exp.company} exp={exp} index={i} />
                ))}
            </div>
        </section>
    )
}

export default Experience
