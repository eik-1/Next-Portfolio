export const metadata = {
    title: "Notes",
    description: "Writing by Sarthak Rawat.",
}

export default function Notes() {
    return (
        <section className="col pt-16 md:pt-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/illustrations/book.webp"
                alt=""
                className="bitmap mb-8 h-40 w-40 object-contain"
            />
            <h1 className="font-serif text-title text-ink">Notes</h1>
            <p className="mt-3 text-read text-soft">
                Nothing here yet. My older posts live on{" "}
                <a
                    href="https://medium.com/@sarthakrawatbiz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ink-link text-ink"
                >
                    Medium
                </a>
                .
            </p>
        </section>
    )
}
