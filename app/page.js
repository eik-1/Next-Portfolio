import Link from "next/link"

import Hero from "@/app/_components/home/Hero"
import NowSection from "@/app/_components/now/NowSection"
import WorkList from "@/app/_components/work/WorkList"
import { projects } from "@/app/_data/work"

export default function Home() {
    return (
        <>
            <Hero />
            <section
                className="col-wide mt-24 md:mt-32"
                aria-labelledby="work-h"
            >
                <div className="max-w-[640px]">
                    <h2 id="work-h" className="label mb-4">
                        Things I&apos;ve worked on
                    </h2>
                    <WorkList items={projects.slice(0, 3)} />
                    <p className="mt-4 ml-3">
                        <Link
                            href="/work"
                            className="ink-link font-sans text-ui text-soft hover:text-ink"
                        >
                            All work, experience and résumé
                        </Link>
                    </p>
                </div>
            </section>
            <div className="mt-24 md:mt-32">
                <NowSection />
            </div>
        </>
    )
}
