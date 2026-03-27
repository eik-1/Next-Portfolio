import Experience from "./_components/Experience"
import Hero from "./_components/Hero"
import Projects from "./_components/Projects"
import Techstack from "./_components/Techstack"

export const revalidate = 604800

export default function Home() {
    return (
        <div>
            <Hero />
            <Techstack />
            <Experience />
            <Projects />
        </div>
    )
}
