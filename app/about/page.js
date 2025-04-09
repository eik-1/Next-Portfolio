import AboutHero from "../_components/AboutHero"

export const revalidate = 604800

export default function About() {
    return (
        <div className="lg:max-h-screen w-full max-h-[130vh]">
            <AboutHero />
        </div>
    )
}
