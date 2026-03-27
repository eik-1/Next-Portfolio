import AboutHero from "../_components/AboutHero"
import { Story, Capabilities } from "../_components/about/AboutSections"

export const revalidate = 604800

export default function About() {
    return (
        <div className="w-full">
            <AboutHero />
            <div className="px-8 lg:px-28 pb-20">
                <Story />
                <Capabilities />
            </div>
        </div>
    )
}
