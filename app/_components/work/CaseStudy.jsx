import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react"
import Link from "next/link"

import Bitmap from "@/app/_components/ui/Bitmap"
import ArchitectureDiagram from "@/app/_components/work/diagrams/ArchitectureDiagram"

/** A case study read like an article: short header, one image, the story, a next link. */
export default function CaseStudy({ project, next }) {
    const links = [
        project.links.live && { href: project.links.live, label: "Visit" },
        project.links.github && { href: project.links.github, label: "Source" },
    ].filter(Boolean)

    return (
        <article className="pt-16 md:pt-24">
            <div className="col">
                <Link
                    href="/work"
                    className="group inline-flex items-center gap-1.5 font-sans text-ui text-soft transition-colors hover:text-ink"
                >
                    <ArrowLeft
                        size={13}
                        strokeWidth={1.5}
                        className="transition-transform duration-[var(--duration-quick)] group-hover:-translate-x-0.5"
                    />
                    Work
                </Link>
                <h1 className="mt-8 font-serif text-title text-ink">
                    {project.title}
                </h1>
                <p className="mt-2 text-read text-soft">{project.summary}</p>
                <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-4 font-sans text-ui sm:grid-cols-3">
                    <div>
                        <dt className="text-faint">Role</dt>
                        <dd className="mt-1 text-ink">{project.role}</dd>
                    </div>
                    <div>
                        <dt className="text-faint">Year</dt>
                        <dd className="mt-1 font-pixel text-pixel text-ink">
                            {project.year}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-faint">Links</dt>
                        <dd className="mt-1 flex flex-wrap gap-3 text-ink">
                            {links.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ink-link inline-flex items-center gap-0.5"
                                >
                                    {l.label}
                                    <ArrowUpRight size={12} strokeWidth={1.5} />
                                </a>
                            ))}
                            {project.links.private && !project.links.github && (
                                <span className="inline-flex items-center gap-1 text-soft">
                                    <Lock size={11} strokeWidth={1.5} /> Private
                                    repo
                                </span>
                            )}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="col-wide mt-10">
                <Bitmap
                    bitmap={project.bitmap}
                    color={project.thumb}
                    alt={`${project.title}`}
                    priority
                    className="aspect-[16/10] w-full rounded-xl ring-1 ring-line"
                />
            </div>

            {project.diagram && (
                <div className="col-wide mt-12">
                    <h2 className="label mb-4">How it&apos;s built</h2>
                    <ArchitectureDiagram name={project.diagram} />
                </div>
            )}

            <div className="col mt-12 space-y-6">
                {project.body.map((p) => (
                    <p
                        key={p.slice(0, 24)}
                        className="text-read text-soft first:text-ink"
                    >
                        {p}
                    </p>
                ))}
                <ul className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-6 font-sans text-ui text-soft">
                    {project.stack.map((s) => (
                        <li key={s}>{s}</li>
                    ))}
                </ul>
            </div>

            {next && (
                <div className="col mt-24">
                    <Link
                        href={`/project/${next.slug}`}
                        className="group flex items-center justify-between rounded-lg bg-tile p-4 transition-colors hover:bg-tile-2"
                    >
                        <span>
                            <span className="label block">Next</span>
                            <span className="text-read text-ink">
                                {next.title}
                            </span>
                        </span>
                        <span
                            aria-hidden
                            className="font-sans text-ui text-soft transition-transform duration-[var(--duration-quick)] group-hover:translate-x-1"
                        >
                            →
                        </span>
                    </Link>
                </div>
            )}
        </article>
    )
}
