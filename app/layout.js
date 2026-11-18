import "@/app/_styles/globals.css"

import Footer from "@/app/_components/chrome/Footer"
import Navbar from "@/app/_components/chrome/Navbar"
import Providers from "@/app/_components/chrome/Providers"
import { site } from "@/app/_data/site"
import { themeScript } from "@/app/_lib/theme"
import { fontVariables } from "@/app/fonts/fonts"

export const metadata = {
    metadataBase: new URL(site.url),
    title: { default: "Sarthak Rawat", template: "%s · Sarthak Rawat" },
    description:
        "Software engineer in India. I build things end to end, read a lot, and keep a small shelf of side projects.",
    openGraph: { title: "Sarthak Rawat", type: "website" },
    twitter: { card: "summary_large_image", creator: "@0xeik" },
}

export const viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fbfbf9" },
        { media: "(prefers-color-scheme: dark)", color: "#121211" },
    ],
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={fontVariables} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className="min-h-dvh">
                <Providers>
                    <Navbar />
                    <main id="main">{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
