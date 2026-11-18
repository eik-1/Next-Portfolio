import { site } from "@/app/_data/site"
import { projects } from "@/app/_data/work"

export const dynamic = "force-static"

export default function sitemap() {
    const pages = ["", "/work", "/about", "/library", "/blogs"]
    return [
        ...pages.map((p) => ({
            url: `${site.url}${p}`,
            changeFrequency: "monthly",
            priority: p === "" ? 1 : 0.7,
        })),
        ...projects.map((p) => ({
            url: `${site.url}/project/${p.slug}`,
            changeFrequency: "yearly",
            priority: 0.6,
        })),
    ]
}
