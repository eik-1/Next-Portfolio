import {
    ListeningChip,
    PlaceChip,
    ReadingChip,
} from "@/app/_components/now/chips"
import Bitmap from "@/app/_components/ui/Bitmap"

import GreetingFlip from "./GreetingFlip"
import KoiPond from "./KoiPond"
import NameSwap from "./NameSwap"

/**
 * The hero is about me: name, two plain sentences with live words in them,
 * and one small photo, with a koi pond drawn around them. On load, "Hey" flips through five languages and back;
 * after that the words only do things when touched.
 */
export default function Hero() {
    return (
        <section className="col-wide relative isolate grid gap-10 pt-16 md:grid-cols-[1fr_auto] md:items-start md:gap-16 md:pt-28">
            <KoiPond />
            <div data-pond-avoid className="order-2 max-w-[560px] md:order-1">
                <h1 className="font-serif text-name tracking-name text-ink">
                    <GreetingFlip />, I&apos;m <NameSwap />.
                </h1>
                <p className="mt-6 text-intro text-soft text-pretty">
                    I&apos;m a software engineer in <PlaceChip />. I like
                    building things end to end, from the screen you tap to the
                    server behind it.
                </p>
                <p className="mt-4 text-intro text-soft text-pretty">
                    Lately I&apos;m reading <ReadingChip /> and listening to{" "}
                    <ListeningChip /> on repeat.
                </p>
            </div>
            <figure
                data-pond-avoid
                className="order-1 justify-self-start md:order-2"
            >
                <Bitmap
                    bitmap="/me/sarthak-dither.png"
                    color="/me/sarthak.webp"
                    alt="Sarthak, in a café"
                    reveal="circle"
                    radius={56}
                    priority
                    develop
                    className="h-24 w-24 rounded-lg md:h-[184px] md:w-[184px] md:rounded-xl"
                />
            </figure>
        </section>
    )
}
