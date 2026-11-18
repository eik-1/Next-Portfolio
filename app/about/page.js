import PhotoDeck from "@/app/_components/about/PhotoDeck"
import ShelfPreview from "@/app/_components/library/ShelfPreview"
import NowSection from "@/app/_components/now/NowSection"
import { socials } from "@/app/_data/site"

export const metadata = {
    title: "About",
    description: "About Sarthak Rawat: books, music and the rest.",
}

const age = () => new Date().getFullYear() - 2003

export default function About() {
    return (
        <article className="pt-16 md:pt-24">
            <div className="col">
                <h1 className="font-serif text-title text-ink">About</h1>

                <div className="mt-10">
                    <PhotoDeck />
                </div>

                <div className="mt-12 space-y-5 text-read text-soft">
                    <p>
                        I&apos;m Sarthak, {age()}, and I live in India. I read
                        philosophy and fiction, including Stoicism, Camus,
                        Dostoevsky and Murakami.
                    </p>
                    <p>
                        I follow markets and travel when I can. When I&apos;m
                        bored, I like building things and taking them apart with
                        AI tools. I&apos;m always happy to chat on{" "}
                        <a
                            href={socials.find((s) => s.label === "X")?.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ink-link text-ink"
                        >
                            X
                        </a>{" "}
                        or{" "}
                        <a
                            href={
                                socials.find((s) => s.label === "LinkedIn")
                                    ?.href
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ink-link text-ink"
                        >
                            LinkedIn
                        </a>
                        .
                    </p>
                </div>
            </div>

            <NowSection className="mt-24" />

            <section className="col-wide mt-24" aria-labelledby="shelf-h">
                <h2 id="shelf-h" className="label mb-4">
                    On the shelf
                </h2>
                <ShelfPreview />
            </section>
        </article>
    )
}
