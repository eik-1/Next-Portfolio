/**
 * Architecture specs, from the résumé only (no invented components or numbers).
 *
 * nodes   { id, label, sub?, zone, info }   info = the hover note (1–2 lines)
 * zones   { id, label }
 * edges   { id, from, to }
 * flows   { id, label, steps: [{ at, caption, via? }] }
 *         via lists the edges a hop rides when it isn't the single edge between
 *         the previous node and `at` (it may run against an arrow).
 * layouts.wide  { cols, rowH, place: { id: [col, row, span?] }, routes: { edgeId: [fromSide, toSide, opts] } }
 *
 * Narrow screens scroll the wide plan sideways inside its tile (see ArchitectureDiagram),
 * so `narrow` simply reuses `wide`.
 */

const capxWide = {
    cols: 4,
    rowH: 84,
    place: {
        app: [0, 2],
        edge: [1, 1],
        gateway: [1, 3],
        api: [2, 1],
        broadcaster: [2, 3],
        redis: [3, 0],
        primary: [3, 1],
        replica: [3, 2],
        timescale: [3, 3],
    },
    routes: {
        e1: ["r", "l"],
        e2: ["r", "l"],
        e3: ["r", "l", { a: -10 }],
        e4: ["r", "l"],
        e5: ["r", "l", { a: 10 }],
        e6: ["l", "r"],
        e7: ["b", "t"],
        e8: ["l", "r"],
        e9: ["l", "r"],
    },
}

const capx = {
    title: "Capx AI · platform backend",
    zones: [
        { id: "clients", label: "Clients" },
        { id: "edge", label: "Edge" },
        { id: "services", label: "Services" },
        { id: "data", label: "Data" },
    ],
    nodes: [
        {
            id: "app",
            label: "Super app",
            sub: "clients",
            zone: "clients",
            info: "Every request and live update starts or ends here.",
        },
        {
            id: "edge",
            label: "Cloudflare Workers",
            sub: "Durable Objects",
            zone: "edge",
            info: "Hosting moved here from AWS App Runner, with runtime secret injection and auto-sleep: ~60% lower cost.",
        },
        {
            id: "gateway",
            label: "API Gateway",
            sub: "WebSockets",
            zone: "edge",
            info: "AWS API Gateway holds the socket connections; every message is signature-checked.",
        },
        {
            id: "api",
            label: "API services",
            sub: "10+ · Node / Express",
            zone: "services",
            info: "Trading, rewards, affiliate and core platform services in TypeScript, on Cloudflare Containers.",
        },
        {
            id: "broadcaster",
            label: "Broadcaster",
            sub: "11 channels",
            zone: "services",
            info: "Fans out live data with per-connection rate limits, violation tracking and automatic blocking.",
        },
        {
            id: "redis",
            label: "Redis",
            sub: "cache",
            zone: "data",
            info: "Hot reads and broadcaster state.",
        },
        {
            id: "primary",
            label: "Postgres primary",
            sub: "50+ tables · 100+ fns",
            zone: "data",
            info: "The source of truth: 50+ tables and 100+ SQL functions.",
        },
        {
            id: "replica",
            label: "Read replicas",
            sub: "Supabase",
            zone: "data",
            info: "A read-replica strategy that took ~80% of read traffic off the primary.",
        },
        {
            id: "timescale",
            label: "TimescaleDB",
            sub: "OHLCV views",
            zone: "data",
            info: "Hypertables and materialised OHLCV views for market-data queries.",
        },
    ],
    edges: [
        { id: "e1", from: "app", to: "edge" },
        { id: "e2", from: "edge", to: "api" },
        { id: "e3", from: "api", to: "redis" },
        { id: "e4", from: "api", to: "primary" },
        { id: "e5", from: "api", to: "replica" },
        { id: "e6", from: "timescale", to: "broadcaster" },
        { id: "e7", from: "api", to: "broadcaster" },
        { id: "e8", from: "broadcaster", to: "gateway" },
        { id: "e9", from: "gateway", to: "app" },
    ],
    flows: [
        {
            id: "read",
            label: "Read a price",
            steps: [
                { at: "app", caption: "the app asks for a price" },
                {
                    at: "edge",
                    caption: "a Cloudflare Worker routes it at the edge",
                },
                { at: "api", caption: "one of 10+ services takes the request" },
                { at: "redis", caption: "Redis answers if it's cached" },
                {
                    at: "replica",
                    via: ["e3", "e5"],
                    caption:
                        "otherwise a read replica · ~80% of reads land here",
                },
            ],
        },
        {
            id: "trade",
            label: "Place a trade",
            steps: [
                { at: "app", caption: "a trade comes in" },
                { at: "edge", caption: "the edge Worker forwards it" },
                { at: "api", caption: "the trading service validates it" },
                { at: "primary", caption: "written to the Postgres primary" },
                {
                    at: "broadcaster",
                    via: ["e4", "e7"],
                    caption: "the broadcaster picks up the change",
                },
                {
                    at: "gateway",
                    caption: "out through API Gateway · signed sockets",
                },
                { at: "app", caption: "every open app sees it" },
            ],
        },
        {
            id: "stream",
            label: "Stream prices",
            steps: [
                {
                    at: "timescale",
                    caption: "TimescaleDB · materialised OHLCV views",
                },
                {
                    at: "broadcaster",
                    caption: "the broadcaster · 11 data channels",
                },
                {
                    at: "gateway",
                    caption: "API Gateway · rate limits per connection",
                },
                { at: "app", caption: "live on every client" },
            ],
        },
    ],
    layouts: { wide: capxWide, narrow: capxWide },
}

const refraktWide = {
    cols: 5,
    rowH: 84,
    place: {
        web: [0, 1],
        auth: [1, 0],
        api: [1, 1],
        pay: [1, 2],
        queue: [2, 1],
        models: [3, 0],
        worker: [3, 1],
        r2: [4, 1],
        ledger: [4, 2],
    },
    routes: {
        a1: ["r", "l"],
        a2: ["t", "b"],
        a3: ["r", "l", { s: -8 }],
        a4: ["r", "l"],
        a5: ["t", "b"],
        a6: ["r", "l"],
        a7: ["b", "t"],
        a8: ["b", "l"],
        a9: ["t", "b"],
        a10: ["r", "l", { a: 8, jog: 22 }],
        a11: ["b", "b", { a: -24, b: -24, lane: 16 }],
    },
}

const refrakt = {
    title: "Refrakt · AI video-ad SaaS",
    zones: [
        { id: "web", label: "Web" },
        { id: "api", label: "API" },
        { id: "billing", label: "Billing" },
        { id: "queue", label: "Queue" },
        { id: "workers", label: "Workers" },
        { id: "data", label: "Data" },
    ],
    nodes: [
        {
            id: "web",
            label: "Next.js app",
            sub: "Vercel",
            zone: "web",
            info: "Onboarding, script editing, checkout and delivery; tRPC + TanStack Query poll job status.",
        },
        {
            id: "auth",
            label: "Supabase Auth",
            sub: "JWT / JWKS",
            zone: "api",
            info: "Every request is authenticated, then checked for ownership of the resource.",
        },
        {
            id: "api",
            label: "Express API",
            sub: "tRPC · Railway",
            zone: "api",
            info: "Typed contracts, ownership checks and Redis-backed rate limits.",
        },
        {
            id: "pay",
            label: "Dodo Payments",
            sub: "signed webhooks",
            zone: "billing",
            info: "Checkout and subscriptions; events arrive as signed, deduplicated webhooks.",
        },
        {
            id: "queue",
            label: "BullMQ",
            sub: "Redis",
            zone: "queue",
            info: "Generation runs as background jobs: idempotent, retried, recovered if a render stalls.",
        },
        {
            id: "models",
            label: "Models",
            sub: "OpenRouter · Fal.ai",
            zone: "workers",
            info: "Scripts via OpenRouter and the Vercel AI SDK (Zod-validated); video via Fal.ai.",
        },
        {
            id: "worker",
            label: "Render worker",
            sub: "Railway",
            zone: "workers",
            info: "Runs the pipeline, shuts down gracefully, and refunds credits exactly when a render fails.",
        },
        {
            id: "r2",
            label: "Cloudflare R2",
            sub: "private media",
            zone: "data",
            info: "Customer media stays private: signed uploads, playback and downloads only.",
        },
        {
            id: "ledger",
            label: "Credit ledger",
            sub: "Postgres",
            zone: "data",
            info: "Atomic deductions, expiring subscription credits, permanent top-ups, exact refunds.",
        },
    ],
    edges: [
        { id: "a1", from: "web", to: "api" },
        { id: "a2", from: "api", to: "auth" },
        { id: "a3", from: "api", to: "queue" },
        { id: "a4", from: "queue", to: "worker" },
        { id: "a5", from: "worker", to: "models" },
        { id: "a6", from: "worker", to: "r2" },
        { id: "a7", from: "worker", to: "ledger" },
        { id: "a8", from: "web", to: "pay" },
        { id: "a9", from: "pay", to: "api" },
        { id: "a10", from: "api", to: "ledger" },
        { id: "a11", from: "api", to: "r2" },
    ],
    flows: [
        {
            id: "generate",
            label: "Generate an ad",
            steps: [
                { at: "web", caption: "you pick a script and press render" },
                {
                    at: "api",
                    caption: "the API checks auth, ownership and credits",
                },
                { at: "queue", caption: "an idempotent job goes on BullMQ" },
                {
                    at: "worker",
                    caption: "a worker picks it up · retries if it stalls",
                },
                { at: "models", caption: "models render the video via Fal.ai" },
                {
                    at: "r2",
                    via: ["a5", "a6"],
                    caption: "the result lands privately in R2",
                },
                {
                    at: "web",
                    via: ["a6", "a4", "a3", "a1"],
                    caption: "the app's polled status flips to ready",
                },
            ],
        },
        {
            id: "credits",
            label: "Buy credits",
            steps: [
                { at: "web", caption: "checkout starts in the app" },
                { at: "pay", caption: "Dodo Payments takes the payment" },
                {
                    at: "api",
                    caption: "a signed, deduplicated webhook arrives",
                },
                {
                    at: "ledger",
                    caption: "credits are added to the ledger atomically",
                },
            ],
        },
        {
            id: "watch",
            label: "Watch a video",
            steps: [
                { at: "web", caption: "you open a finished ad" },
                { at: "api", caption: "the API checks it's yours" },
                { at: "r2", caption: "R2 hands back a short-lived signed URL" },
                {
                    at: "web",
                    via: ["a11", "a1"],
                    caption: "it plays; the file is never public",
                },
            ],
        },
    ],
    layouts: { wide: refraktWide, narrow: refraktWide },
}

export const SPECS = { capx, refrakt }
