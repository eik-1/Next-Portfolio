import { notFound } from "next/navigation"

import CaseStudy from "@/app/_components/work/CaseStudy"
import { getProject, projects } from "@/app/_data/work"

export const dynamicParams = false

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
    const { slug } = await params
    const project = getProject(slug)
    if (!project) return {}
    return { title: project.title, description: project.summary }
}

export default async function ProjectPage({ params }) {
    const { slug } = await params
    const i = projects.findIndex((p) => p.slug === slug)
    if (i === -1) notFound()
    const next = projects[(i + 1) % projects.length]
    return <CaseStudy project={projects[i]} next={next} />
}
