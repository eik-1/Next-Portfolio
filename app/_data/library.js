/**
 * The library — books on the shelf (the main event) and a few records on the side.
 *
 * Books: `status` is "read" | "reading". `spine` picks one of the token tones
 * (ink | paper | canvas | sunken | red | blue) so the shelf stays on-palette.
 * `quote` is a short line from the book itself, not a review.
 */
export const books = [
    {
        id: "meditations",
        title: "Meditations",
        author: "Marcus Aurelius",
        year: "c. 180",
        status: "read",
        spine: "ink",
        theme: "Stoicism",
        quote: "The impediment to action advances action. What stands in the way becomes the way.",
    },
    {
        id: "deep-work",
        title: "Deep Work",
        author: "Cal Newport",
        year: "2016",
        status: "read",
        spine: "red",
        theme: "Focus",
        quote: "Clarity about what matters provides clarity about what does not.",
    },
    {
        id: "brothers-karamazov",
        title: "The Brothers Karamazov",
        author: "Fyodor Dostoevsky",
        year: "1880",
        status: "read",
        spine: "sunken",
        theme: "Fiction",
        quote: "Above all, don't lie to yourself.",
    },
    {
        id: "myth-of-sisyphus",
        title: "The Myth of Sisyphus",
        author: "Albert Camus",
        year: "1942",
        status: "read",
        spine: "paper",
        theme: "Absurdism",
        quote: "One must imagine Sisyphus happy.",
    },
    {
        id: "kafka-on-the-shore",
        title: "Kafka on the Shore",
        author: "Haruki Murakami",
        year: "2002",
        status: "read",
        spine: "canvas",
        theme: "Fiction",
        quote: "And once the storm is over, you won't remember how you made it through, how you managed to survive.",
    },
    {
        id: "1984",
        title: "1984",
        author: "George Orwell",
        year: "1949",
        status: "read",
        spine: "ink",
        theme: "Fiction",
        quote: "Who controls the past controls the future. Who controls the present controls the past.",
    },
    {
        id: "the-prince",
        title: "The Prince",
        author: "Niccolò Machiavelli",
        year: "1532",
        status: "read",
        spine: "sunken",
        theme: "Power",
        quote: "It is much safer to be feared than loved, if you cannot be both.",
    },
    {
        id: "cant-hurt-me",
        title: "Can't Hurt Me",
        author: "David Goggins",
        year: "2018",
        status: "read",
        spine: "ink",
        theme: "Discipline",
        quote: "You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential.",
    },
    {
        id: "the-alchemist",
        title: "The Alchemist",
        author: "Paulo Coelho",
        year: "1988",
        status: "read",
        spine: "blue",
        theme: "Fable",
        quote: "When you want something, all the universe conspires in helping you to achieve it.",
    },
    {
        id: "richest-man-in-babylon",
        title: "The Richest Man in Babylon",
        author: "George S. Clason",
        year: "1926",
        status: "read",
        spine: "canvas",
        theme: "Money",
        quote: "A part of all you earn is yours to keep.",
    },
    {
        id: "protocols",
        title: "Protocols",
        author: "Andrew Huberman",
        year: "2025",
        status: "reading",
        spine: "paper",
        theme: "Health",
        quote: null,
    },
    {
        id: "daily-stoic",
        title: "The Daily Stoic",
        author: "Ryan Holiday & Stephen Hanselman",
        year: "2016",
        status: "reading",
        spine: "ink",
        theme: "Stoicism",
        quote: null,
    },
    {
        id: "50-quantum-physics-ideas",
        title: "50 Quantum Physics Ideas You Really Need to Know",
        author: "Joanne Baker",
        year: "2013",
        status: "reading",
        spine: "sunken",
        theme: "Physics",
        quote: null,
    },
]

/** Apple Music search, for a song added without a direct link. */
export const appleMusic = (q) =>
    `https://music.apple.com/us/search?term=${encodeURIComponent(q)}`

/**
 * On repeat: the songs I choose to show, in order. The first is the one in
 * the hero ("listening to …"); the record player flips through all of them.
 * `apple` is the song's Apple Music id and `href` its page (both optional:
 * without them the site searches by title and artist); the 30-second
 * preview comes from the same catalogue (`_lib/player.js`).
 */
export const records = [
    {
        id: "vienna",
        title: "Vienna",
        artist: "Billy Joel",
        album: "The Stranger",
        year: "1977",
        apple: 158618071, // Apple Music song id
        href: "https://music.apple.com/us/album/vienna/158617952?i=158618071",
    },
    {
        id: "my-way",
        title: "My Way",
        artist: "Frank Sinatra",
        album: "My Way",
        year: "1969",
        apple: 1475517693, // Apple Music song id
        href: "https://music.apple.com/us/album/my-way/1475517532?i=1475517693",
    },
    {
        id: "let-down",
        title: "Let Down",
        artist: "Radiohead",
        album: "OK Computer",
        year: "1997",
        apple: 1097861834, // Apple Music song id
        href: "https://music.apple.com/us/album/let-down/1097861387?i=1097861834",
    },
    {
        id: "let-it-be",
        title: "Let It Be",
        artist: "The Beatles",
        album: "Let It Be",
        year: "1970",
        apple: 1441164738, // Apple Music song id
        href: "https://music.apple.com/us/album/let-it-be/1441164495?i=1441164738",
    },
    {
        id: "heavens-door",
        title: "Knockin' on Heaven's Door",
        artist: "Bob Dylan",
        album: "Pat Garrett & Billy the Kid",
        year: "1973",
        apple: 717157149, // Apple Music song id
        href: "https://music.apple.com/us/album/knockin-on-heavens-door/717157086?i=717157149",
    },
    {
        id: "slow-it-down",
        title: "Slow It Down",
        artist: "Mike Posner",
        album: "Keep Going",
        year: "2019",
        apple: 1481602809, // Apple Music song id
        href: "https://music.apple.com/us/album/slow-it-down/1481602491?i=1481602809",
    },
    {
        id: "baby-come-back",
        title: "Baby Come Back",
        artist: "Player",
        album: "Player",
        year: "1977",
        apple: 1458825378, // Apple Music song id
        href: "https://music.apple.com/us/album/baby-come-back/1458825368?i=1458825378",
    },
    {
        id: "all-the-love",
        title: "All the Love",
        artist: "Kanye West",
        album: "Bully",
        year: "2026",
        apple: 1888707290, // Apple Music song id
        href: "https://music.apple.com/us/album/all-the-love/1888707282?i=1888707290",
    },
    {
        id: "come-to-life",
        title: "Come to Life",
        artist: "Kanye West",
        album: "Donda",
        year: "2021",
        apple: 1587795934, // Apple Music song id
        href: "https://music.apple.com/us/album/come-to-life/1587795158?i=1587795934",
    },
    {
        id: "new-dawn-fades",
        title: "New Dawn Fades",
        artist: "Moby",
        album: "I Like to Score",
        year: "1997",
        apple: 1784267318, // Apple Music song id
        href: "https://music.apple.com/us/album/new-dawn-fades/1784267046?i=1784267318",
    },
]
