import dBeats from "@/public/dbeats.webp"
import snapStudio from "@/public/snap_studio.png"
import nolo from "@/public/nolo.png"
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

import viem from "@/public/viem.png"

export const projects = [
    {
        id: 1,
        title: "SnapStudio",
        des: "Generate AI generated images of yourself",
        img: snapStudio,
        img2: "",
        chainlink: false,
        viem: false,
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
        viem: false,
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
    {
        id: 3,
        title: "NoLo Lottery",
        des: "No Loss Yield Lottery",
        img: nolo,
        img2: "",
        chainlink: true,
        viem: true,
        iconLists: [
            { Icon: SolidityOriginal, name: "Solidity" },
            { Icon: TypescriptOriginal, name: "TypeScript" },
            { Icon: NextjsPlain, name: "NextJs" },
            { Icon: TailwindcssOriginal, name: "Tailwind CSS" },
            { Icon: GraphqlPlain, name: "GraphQL" },
        ],
        link: "https://no-loss-yield-lottery-mu.vercel.app",
        github: {
            isPrivate: false,
            url: "https://github.com/eik-1/No-Loss-Yield-Lottery",
        },
        paragraph1:
            "NoLo is a no-loss yield lottery decentralized application. Participants enter the lottery by staking LINK tokens into a collective pool. This capital is then put to work in a decentralized finance (DeFi) protocol called Aave to generate yield. The accumulated yield from all staked LINK forms the prize, which is awarded to a single, randomly selected winner at the end of each round. The key feature is that participants can withdraw their initial stake at any time, meaning they only risk their potential earnings, not their principal.",
        paragraph2:
            "The application's backend is powered by a Solidity-based smart contract, developed and tested using the Foundry framework. It leverages Chainlink Automation for triggering round resets & winner selection and Chainlink VRF (Verifiable Random Function) to ensure provably fair winner selection. The UI is a dynamic Next.js application built with TypeScript and styled using Tailwind CSS. It connects to the blockchain via Wagmi, providing a smooth and intuitive experience for users to manage their stake and participate in the lottery.",
    },
]
