# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for a Web3 developer (Eik/Sarthak). Built with Next.js 14 App Router, configured for **full static export** (`output: "export"` in next.config.mjs). No server runtime, no API routes, no database — all content is hardcoded in source files.

## Commands

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Static export to `out/` directory
- `npm run lint` — ESLint via `next lint` (extends `next/core-web-vitals`)
- No test framework is installed

## Architecture

### Static Export Constraint

The site compiles to pure static HTML/CSS/JS. This means:
- No server components that fetch data at request time
- No API routes
- `images.unoptimized: true` is required (no image optimization server)
- `revalidate` exports on pages are no-ops (leftover from ISR setup)

### Routing

```
app/page.js              → /
app/about/page.js        → /about
app/blogs/page.js        → /blogs (placeholder)
app/project/[projectId]/ → /project/:slug (statically generated via generateStaticParams)
```

Project slugs are derived from `projects` array titles converted to kebab-case.

### Data

All portfolio content lives in `app/utils/projects.js` — a single array of project objects with metadata, descriptions, and icon lists. This is the only "data source" in the app.

### Animation Stack (Two Libraries)

- **framer-motion**: Entrance animations, hover states, page transitions, ShinyButton shimmer
- **GSAP + ScrollTrigger**: Horizontal scrolling skill marquee in `SkillsList.jsx` only

### 3D Rendering

`Hero.jsx` renders a Three.js canvas via `@react-three/fiber`. The Ethereum GLTF model component is dynamically imported with `ssr: false` from `public/Ethereum.jsx`.

### Fonts

Four custom fonts defined in `app/fonts/fonts.js` and consumed via `.className` throughout components: PPNeueMontreal-Thin, PPNeueMontreal-Medium, GT-Alpina, GeistVF.

### Styling

Tailwind CSS 3 with utility classes only. No CSS modules or custom global styles. Desktop breakpoint is `lg:`.

### Path Alias

`@/*` maps to project root (jsconfig.json), so imports look like `@/app/...`, `@/public/...`.

### Formatting

Prettier config: 4-space indent, no semicolons, double quotes.

## Design System & Procedures

Follow these procedures on every frontend change to maintain a consistent, managed design across the project.

### Colors — Use Semantic Tokens, Never Raw Values

All colors must be defined as semantic tokens in `tailwind.config.js` under `theme.extend.colors` and referenced by name in components. Never use raw Tailwind palette colors (`red-500`, `gray-100`) or hex values directly in className strings.

**Current token map** (extend as needed, always in tailwind.config.js):

| Token Name | Purpose | Current Value |
|---|---|---|
| `accent` | Primary accent, hover states, underlines, highlights | `red-500` (#ef4444) |
| `surface` | Page background | `gray-100` (#f3f4f6) |
| `on-surface` | Primary text on surface | `black` (#000000) |
| `on-accent` | Text on accent backgrounds | `gray-100` (#f3f4f6) |
| `muted` | Secondary/descriptive text | `gray-500` (#6b7280) |
| `border` | Dividers, hr, borders | `gray-400` (#9ca3af) |
| `tooltip-bg` | Tooltip backgrounds | `black` (#000000) |
| `tooltip-text` | Tooltip text | `gray-200` (#e5e7eb) |

**Rule:** When introducing a new color, add it as a token first. If a raw color appears in a className, it's a bug.

### Typography — Defined Scale & Font Roles

**Font roles** (defined in `app/fonts/fonts.js`, applied via `.className`):

| Font | Role | Usage |
|---|---|---|
| `neueMontrealThin` | Display / Hero | Hero headings, preloader, logo, project page titles |
| `neueMontrealMedium` | Body default | Set on `<body>` via layout.js — all body text inherits this |
| `gtAlpina` | Decorative / Editorial | Section headings ("Projects", "Techstack"), stylized names, accent text |
| `geist` | Utility / UI | Buttons, labels, small UI elements (currently underused) |

**Rule:** Never import fonts directly in a component. Always import from `@/app/fonts/fonts.js`.

**Type scale** — use only these size tokens (map to Tailwind classes). Do not invent arbitrary `text-[Xrem]` values:

| Token | Mobile | Desktop (`lg:`) | Usage |
|---|---|---|---|
| `display` | `text-5xl` | `text-[9rem]` | Hero name, main page title (one per page max) |
| `section-heading` | `text-[3rem]` | `text-[8rem]` | Section titles ("Projects", "Techstack") |
| `page-title` | `text-5xl` | `text-7xl` | Project detail page title |
| `subtitle` | `text-xl` | `text-2xl` | Project detail subtitle, about heading |
| `heading` | `text-2xl` | `text-4xl` | Sub-section headings, about name |
| `body-large` | `text-base` | `text-xl` | About description text, project detail paragraphs |
| `body` | `text-base` | `text-base` | Default body text |
| `body-small` | `text-sm` | `text-sm` | Descriptions, footer links, tooltips |
| `nav` | `text-2xl` | `text-2xl` | Navigation links |
| `button` | `text-sm` | `text-sm` | Button labels |

### Spacing — Consistent Rhythm

**Section-level spacing** (standard across all sections):

| Property | Value | Usage |
|---|---|---|
| Horizontal page padding | `px-8 lg:px-28` | All major sections (Hero, Techstack, Projects, Footer) |
| Section bottom margin | `pb-20 lg:pb-20` | Space between sections |
| Section top offset | `mt-28 lg:mt-24` | Content below fixed navbar |
| Container max-width | `max-w-[1200px] mx-auto` | Project detail pages |

**Component-level spacing:**

| Context | Token | Value |
|---|---|---|
| Card/element gap in grids | `gap` | `gap-10 lg:gap-20` |
| Inline element gaps | `gap` | `gap-2` (tight), `gap-4` (normal), `gap-8` (wide) |
| Button padding | `px/py` | `px-4 py-2` (standard), `px-5 py-3` (large) |
| Paragraph spacing | `mb` | `mb-4` |
| Divider margins | `my` | `my-5` |

**Rule:** Avoid arbitrary spacing values like `py-[10px]` or `mt-32`. Use the Tailwind default scale (multiples of 4px: `1`=4px, `2`=8px, `3`=12px, `4`=16px, etc.) and the tokens above.

### Interactive States — Consistent Patterns

All interactive elements must follow these patterns:

| Pattern | Implementation |
|---|---|
| Link hover underline | `after:` pseudo-element, `bg-accent`, `scale-x-0 → scale-x-100`, `origin-left`, `duration-300` |
| Text hover color | `hover:text-accent transition-colors duration-300` |
| Button hover (filled) | `bg-on-surface text-tooltip-text hover:bg-accent transition-colors duration-300` |
| Button hover (outline) | `border border-on-surface hover:border-accent transition-colors duration-300` |
| Highlighted text spans | `bg-accent bg-opacity-90 text-on-accent px-2` |

**Rule:** Every `hover:` must have a matching `transition-*` with `duration-300`. No instant state changes.

### Procedure Checklist — Before Every Frontend Change

1. **Color check:** Are all colors referencing semantic tokens from `tailwind.config.js`? No raw `red-500`, `gray-*`, `black`, `white`, or hex values in classNames.
2. **Type check:** Does the text size match one of the defined scale tokens above? Is the correct font role applied?
3. **Spacing check:** Does section padding use `px-8 lg:px-28`? Are gaps using standard multiples? No arbitrary pixel values?
4. **Hover check:** Does every interactive element have a `transition-*` and `duration-300`?
5. **Font import check:** Are fonts imported from `@/app/fonts/fonts.js`, not defined locally?
6. **Responsive check:** Does the component define both mobile-first and `lg:` breakpoint values where layout shifts?

## Known Issues

- `public/Ethereum.jsx` is a React component living in the static assets directory (works but unconventional). A duplicate exists at `app/_components/Ethereum.jsx` (unused).
- `ResumeButton.jsx` and `ShinyButton.jsx` use framer-motion without `"use client"` directive (works only because parent components are client components).
- `tailwind.config.js` has a `spotlight` animation defined at root `extend` instead of inside `theme.extend` — the animation class is never generated.
- `react-intersection-observer` is installed but unused.
