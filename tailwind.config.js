/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--background) / <alpha-value>)",
                foreground: "rgb(var(--foreground) / <alpha-value>)",
                accent: "rgb(var(--accent) / <alpha-value>)",
                surface: "rgb(var(--surface) / <alpha-value>)",
                "on-surface": "rgb(var(--on-surface) / <alpha-value>)",
                "on-accent": "rgb(var(--on-accent) / <alpha-value>)",
                muted: "rgb(var(--muted) / <alpha-value>)",
                "muted-light": "rgb(var(--muted-light) / <alpha-value>)",
                border: "rgb(var(--border) / <alpha-value>)",
                "tooltip-bg": "rgb(var(--tooltip-bg) / <alpha-value>)",
                "tooltip-text": "rgb(var(--tooltip-text) / <alpha-value>)",
            },
            animation: {
                spotlight: "spotlight 2s ease .75s 1 forwards",
                marquee: "marquee 35s linear infinite",
            },
            keyframes: {
                spotlight: {
                    "0%": {
                        opacity: 0,
                        transform: "translate(-72%, -62%) scale(0.5)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translate(-50%,-40%) scale(1)",
                    },
                },
                marquee: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
            },
        },
    },
    plugins: [],
}
