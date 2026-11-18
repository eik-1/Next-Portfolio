import Link from "next/link"

export const metadata = { title: "Not found" }

export default function NotFound() {
    return (
        <section className="col pt-16 md:pt-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/illustrations/headphones.webp"
                alt=""
                className="bitmap mb-8 h-40 w-40 object-contain"
            />
            <p className="font-pixel text-pixel text-faint">404</p>
            <h1 className="mt-3 font-serif text-title text-ink">
                This page isn&apos;t here.
            </h1>
            <p className="mt-3 text-read text-soft">
                It may have moved, or never existed.{" "}
                <Link href="/" className="ink-link text-ink">
                    Go home
                </Link>
                .
            </p>
        </section>
    )
}
