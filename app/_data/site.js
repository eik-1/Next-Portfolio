/**
 * Everything about the person, in one place. Edit here, not in components.
 * Work facts mirror the résumé (site.resume); keep them in sync.
 */
export const site = {
    name: "Sarthak Rawat",
    fullName: "Sarthak Singh Rawat",
    handle: "eik",
    role: "Software engineer",
    location: "India",
    timezone: "Asia/Kolkata",
    email: "sarthakrawatbiz@gmail.com",
    resume: "https://drive.google.com/file/d/1Kvd_ikPXQNVMF0BPBjqo1uyigRto1zhQ/view?usp=sharing",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://eik.me",
    availability: "Open to engineering roles",
    summary:
        "Full-stack engineer, most at home in the parts users never see: data models, job queues, realtime systems and the infrastructure under them. I led backend delivery for Capx AI's launch, and built Refrakt, an AI video-ad product, from design to launch.",
}

export const socials = [
    { label: "GitHub", href: "https://github.com/eik-1", short: "gh" },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/sarthakeik1/",
        short: "in",
    },
    { label: "X", href: "https://x.com/0xeik", short: "x" },
    {
        label: "Medium",
        href: "https://medium.com/@sarthakrawatbiz",
        short: "md",
    },
]

/**
 * Skills, exactly as grouped on the résumé. Each name can be cross-referenced
 * against `stack` in work.js so hovering a skill highlights where it was used.
 */
export const skills = [
    {
        group: "Engineering",
        names: [
            "System Design",
            "API Design",
            "Data Modeling",
            "Asynchronous Processing",
            "Idempotency",
            "Failure Recovery",
            "Authentication",
            "Rate Limiting",
        ],
    },
    {
        group: "Languages",
        names: [
            "TypeScript",
            "JavaScript",
            "Python",
            "SQL",
            "Solidity",
            "Rust",
        ],
    },
    {
        group: "Applications & APIs",
        names: [
            "Node.js",
            "Express.js",
            "React",
            "Next.js",
            "tRPC",
            "REST APIs",
            "WebSockets",
            "TanStack Query",
            "Tailwind CSS",
            "HTML",
            "CSS",
            "Zod",
        ],
    },
    {
        group: "Data & Infrastructure",
        names: [
            "PostgreSQL",
            "TimescaleDB",
            "Redis",
            "Drizzle ORM",
            "BullMQ",
            "Supabase",
            "AWS",
            "Cloudflare Workers",
            "Durable Objects",
            "Containers",
            "R2",
            "Vercel",
            "Railway",
        ],
    },
    {
        group: "Engineering Tooling",
        names: [
            "Git",
            "Docker",
            "GitHub Actions",
            "CI/CD",
            "Linux",
            "CLI Development",
            "npm Publishing",
            "Node.js Test Runner",
        ],
    },
    {
        group: "AI & Integrations",
        names: [
            "OpenRouter",
            "Vercel AI SDK",
            "Fal.ai",
            "Dodo Payments",
            "Stripe",
            "Webhooks",
            "AI-Agent Skills",
        ],
    },
    {
        group: "Smart Contracts",
        names: [
            "Foundry",
            "Hardhat",
            "OpenZeppelin",
            "Upgradeable Proxies",
            "Viem",
            "Wagmi",
            "Chainlink VRF & Automation",
        ],
    },
]
