"use client"

import { motion } from "framer-motion"

import { gtAlpina } from "@/app/fonts/fonts"

const SKILLS = [
    {
        category: "Backend Engineering",
        desc: "Microservices and real-time systems at scale.",
        items: ["TypeScript", "Express", "Node.js", "tRPC", "PostgreSQL", "Redis", "MongoDB", "Supabase"],
    },
    {
        category: "Frontend Development",
        desc: "Performant interfaces with clean architecture.",
        items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Wagmi", "Viem"],
    },
    {
        category: "DevOps & Infrastructure",
        desc: "Edge deployments and optimized cloud systems.",
        items: ["AWS", "Cloudflare", "Docker", "Linux", "CI/CD", "Vercel"],
    },
    {
        category: "AI & Tooling",
        desc: "AI-assisted development and intelligent apps.",
        items: ["Python", "LangChain", "OpenAI API", "Anthropic SDK", "Cursor", "Claude Code"],
    },
]


const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
}

function SectionLabel({ number, title }) {
    return (
        <div className="flex items-center gap-4 mb-8 lg:mb-12">
            <span className="text-accent text-sm tracking-[0.3em]">
                {number}
            </span>
            <span className="text-xs tracking-[0.3em] text-on-surface/40 uppercase">
                {title}
            </span>
            <div
                className="flex-1 h-px"
                style={{
                    background:
                        "linear-gradient(90deg, rgba(239,68,68,0.3) 0%, transparent 100%)",
                }}
            />
        </div>
    )
}

function AnimatedSection({ children, className = "" }) {
    return (
        <motion.section
            className={`mb-20 lg:mb-28 ${className}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                visible: { transition: { staggerChildren: 0.1 } },
            }}
        >
            {children}
        </motion.section>
    )
}

function Story() {
    const age =
        new Date().getFullYear() -
        2003 -
        (new Date().getMonth() < 0 ? 1 : 0)

    return (
        <AnimatedSection>
            <motion.div variants={fadeIn}>
                <SectionLabel number="01" title="About Me" />
            </motion.div>
            <motion.div className="max-w-3xl" variants={fadeIn}>
                <p className="text-on-surface/70 text-base lg:text-lg leading-relaxed mb-5">
                    <span className={`text-accent ${gtAlpina.className}`}>Hey!</span>{" "}
                    I&apos;m Sarthak, a {age}-year-old Full Stack Engineer from
                    India. I like to build things with code and break them with
                    AI tools when I&apos;m bored. Finance and markets genuinely
                    fascinate me.
                </p>
                <p className="text-on-surface/70 text-base lg:text-lg leading-relaxed mb-5">
                    My work focuses on backend systems and blockchain
                    infrastructure. I currently work at{" "}
                    <span className={`text-accent ${gtAlpina.className}`}>Capx AI</span>
                    , where I led the backend for a mainnet launch. I also enjoy
                    building{" "}
                    <span className={`text-accent ${gtAlpina.className}`}>
                        side projects
                    </span>{" "}
                    and contributing to open source.
                </p>
                <p className="text-on-surface/70 text-base lg:text-lg leading-relaxed">
                    Outside of software, I practice{" "}
                    <span
                        className={`text-accent ${gtAlpina.className} text-lg lg:text-xl`}
                    >
                        philosophy
                    </span>{" "}
                    (mostly stoicism and metaphysics), and I have a passion for
                    exploring the world. I&apos;m open to relocating and always
                    up for a chat.
                </p>
            </motion.div>
        </AnimatedSection>
    )
}

function Capabilities() {
    return (
        <AnimatedSection>
            <motion.div variants={fadeIn}>
                <SectionLabel number="02" title="What I Build" />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                {SKILLS.map((skill, idx) => (
                    <motion.div
                        key={skill.category}
                        className="group relative border border-accent/15 rounded-2xl p-6 lg:p-8 overflow-hidden transition-all duration-500 hover:border-accent/35 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                        variants={fadeIn}
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <span
                            className={`${gtAlpina.className} absolute -top-4 -right-2 text-[7rem] lg:text-[8rem] leading-none text-on-surface/[0.03] group-hover:text-accent/[0.06] transition-colors duration-500 select-none pointer-events-none`}
                        >
                            {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-on-surface text-lg lg:text-xl mb-1 relative z-10">
                            {skill.category}
                        </h3>
                        <p className="text-on-surface/35 text-xs lg:text-sm mb-5 relative z-10">
                            {skill.desc}
                        </p>
                        <div className="flex flex-wrap gap-2 relative z-10">
                            {skill.items.map((item) => (
                                <span
                                    key={item}
                                    className="text-[0.68rem] tracking-[0.03em] text-on-accent bg-accent/80 group-hover:bg-accent rounded-full px-3 py-1.5 transition-colors duration-300"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </AnimatedSection>
    )
}

export { Story, Capabilities }
