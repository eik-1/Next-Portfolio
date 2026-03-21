import { gtAlpina } from "@/app/fonts/fonts"

export const revalidate = 604800

export default function Blogs() {
    return (
        <div className="h-screen flex justify-center items-center text-center lg:text-7xl text-5xl">
            <h1 className={`text-on-surface ${gtAlpina.className}`}>
                Coming Soon!
            </h1>
        </div>
    )
}
