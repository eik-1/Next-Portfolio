import dBeats from "@/public/dbeats.webp"
import snapStudio from "@/public/snap_studio.png"
import {
    ExpressOriginal,
    GraphqlPlain,
    HardhatOriginal,
    JavascriptOriginal,
    MongodbOriginalWordmark,
    NextjsPlain,
    NodejsOriginalWordmark,
    PostgresqlOriginal,
    ReactOriginal,
    RedisOriginal,
    ReduxOriginal,
    RustOriginal,
    SolidityOriginal,
    SupabaseOriginal,
    TailwindcssOriginal,
    TypescriptOriginal,
} from "devicons-react"

export const projects = [
    {
        id: 1,
        title: "SnapStudio",
        des: "Generate AI generated images of yourself",
        img: snapStudio,
        img2: "",
        chainlink: false,
        iconLists: [
            { Icon: ReactOriginal, name: "React" },
            { Icon: SupabaseOriginal, name: "Supabase" },
            { Icon: NodejsOriginalWordmark, name: "NodeJs" },
            { Icon: JavascriptOriginal, name: "JavaScript" },
            { Icon: TailwindcssOriginal, name: "Tailwind CSS" },
        ],
        link: "https://snapstudio.me",
        github: {
            isPrivate: true,
            url: "",
        },
        paragraph1:
            "SnapStudio is an application designed to help users generate personalized AI-enhanced images based on their prompts. Utilizing the Flux Dev LoRA model from Replicate, the app allows users to upload multiple images of themselves, which are then processed to create custom AI models. These models enable the users to generate realistic images that look similar to them, making the application appealing for those looking to create personalized content for social media, marketing, or personal use. A future feature will also allow users to virtually try on dresses of their choice, further enhancing the customization and personalization options available within the platform.",
        paragraph2:
            "The tech stack for SnapStudio includes React and Tailwind CSS for the frontend, ensuring a responsive and visually appealing user interface. The backend is powered by Node.js and Express.js, with Supabase serving as the database and authentication solution. The application also incorporates features such as user authentication, image management, and a seamless image generation process.",
    },
    {
        id: 2,
        title: "DBeats",
        des: "NFT Marketplace For Music",
        img: dBeats,
        img2: "",
        chainlink: true,
        iconLists: [
            { Icon: SolidityOriginal, name: "Solidity" },
            { Icon: HardhatOriginal, name: "Hardhat" },
            { Icon: JavascriptOriginal, name: "JavaScript" },
            { Icon: ReactOriginal, name: "React" },
            { Icon: NodejsOriginalWordmark, name: "NodeJs" },
            { Icon: MongodbOriginalWordmark, name: "MongoDB" },
            { Icon: GraphqlPlain, name: "GraphQL" },
            { Icon: ExpressOriginal, name: "Express" },
        ],
        link: "https://dbeats-base.vercel.app",
        github: {
            isPrivate: false,
            url: "https://github.com/eik-1/dbeats-base",
        },
        paragraph1:
            "DBeats is a decentralized music marketplace on Base, designed to empower artists by allowing them to mint, showcase, and sell their music NFTs. It was submitted to the Base India Batch 001. The application features user profiles where artists can manage their information, apply for artist status, and display their minted tracks. It utilizes a React frontend with a responsive design, ensuring a seamless user experience across devices.",
        paragraph2:
            "The tech stack includes React for the frontend, utilizing libraries such as React Router for navigation and TanStack Query for data fetching. The styling is managed with Tailwind CSS, providing a utility-first approach to design. The backend is powered by Node.js, Express, and MongoDB for data storage, with GraphQL for querying NFT data. Smart contracts are developed using Solidity & Hardhat, with the project also leveraging Web3Modal for wallet connections. The project is structured to facilitate easy deployment and scalability, making it a robust solution for music artists in the NFT space.",
    },
]
