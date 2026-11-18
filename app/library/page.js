import BookIndex from "@/app/_components/library/BookIndex"
import Bookshelf from "@/app/_components/library/Bookshelf"

export const metadata = {
    title: "Library",
    description:
        "The books on Sarthak Rawat's shelf, and the one line he kept from each.",
}

export default function LibraryPage() {
    return (
        <div className="pt-10 md:pt-16">
            <header className="col">
                <h1 className="font-serif text-title tracking-tight text-ink">
                    Library
                </h1>
                <p className="mt-4 text-pretty">
                    I mostly read philosophy and fiction. When I finish a book I
                    keep one line from it. Pull one off the shelf to read the
                    line I kept.
                </p>
            </header>
            <div className="col mt-12 md:mt-14">
                <Bookshelf />
            </div>
            <div className="col mt-20 md:mt-24">
                <BookIndex />
            </div>
        </div>
    )
}
