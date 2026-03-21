import ClientPreloader from "@/app/_components/ClientPreloader"
import Footer from "@/app/_components/Footer"
import Navbar from "@/app/_components/Navbar"
import "@/app/_styles/globals.css"
import { neueMontrealMedium } from "@/app/fonts/fonts"

export const metadata = {
    title: "Eik - Web3",
    description: "Portfolio Website for Eik, a Web3 Developer",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${neueMontrealMedium.className} antialiased flex flex-col min-h-screen text-on-surface bg-surface`}
            >
                <ClientPreloader>
                    <Navbar />
                    <div className="flex-grow">{children}</div>
                    <Footer />
                </ClientPreloader>
            </body>
        </html>
    )
}
