import GithubActivity from "@/app/_components/work/proof/GithubActivity"
import NpmTerminal from "@/app/_components/work/proof/NpmTerminal"
import RecentRepos from "@/app/_components/work/proof/RecentRepos"
import { ExperienceLedger, ProjectLedger } from "@/app/_components/work/Ledger"
import ResumeActions from "@/app/_components/work/ResumeActions"
import { SkillFocusProvider } from "@/app/_components/work/skillFocus"
import SkillsBoard from "@/app/_components/work/SkillsBoard"
import { site, skills } from "@/app/_data/site"
import { experience, projects } from "@/app/_data/work"

export const metadata = {
    title: "Work",
    description: "Sarthak Rawat's experience, projects, skills and résumé.",
}

/** How many roles/projects on this page use each skill (for the skills board). */
function usageMap() {
    const all = [
        ...experience.map((e) => e.stack),
        ...projects.map((p) => p.stack),
    ]
    const map = {}
    for (const stack of all) for (const s of stack) map[s] = (map[s] ?? 0) + 1
    return map
}

function Section({ id, title, aside, children, className = "" }) {
    return (
        <section
            aria-labelledby={id}
            className={`mx-auto mt-20 w-full max-w-[760px] px-5 md:mt-28 ${className}`}
        >
            <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 id={id} className="label">
                    {title}
                </h2>
                {aside}
            </div>
            {children}
        </section>
    )
}

export default function WorkPage() {
    return (
        <SkillFocusProvider>
            <header className="mx-auto w-full max-w-[760px] px-5 pt-16 md:pt-24">
                <h1 className="font-serif text-title text-ink">Work</h1>
                {site.availability && (
                    <p className="mt-3 flex items-center gap-2 font-sans text-ui text-soft">
                        <span
                            aria-hidden
                            className="h-1.5 w-1.5 shrink-0 animate-pixel-pulse bg-live"
                        />
                        {site.availability}
                    </p>
                )}
                <p className="mt-4 max-w-[60ch] text-read text-soft text-pretty">
                    {site.summary}
                </p>
                <div className="mt-8">
                    <ResumeActions />
                </div>
            </header>

            <Section id="exp-h" title="Experience">
                <ExperienceLedger items={experience} />
            </Section>

            <Section id="proj-h" title="Projects">
                <ProjectLedger items={projects} />
            </Section>

            <Section
                id="skills-h"
                title="Skills"
                aside={
                    <span className="font-sans text-ui text-faint">
                        Hover one to see where I used it
                    </span>
                }
            >
                <SkillsBoard groups={skills} usage={usageMap()} />
            </Section>

            <Section id="oss-h" title="Open source & activity">
                <GithubActivity />
                <div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr] md:items-start">
                    <NpmTerminal />
                    <RecentRepos />
                </div>
            </Section>
        </SkillFocusProvider>
    )
}
