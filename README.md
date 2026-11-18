# eik

The personal site of Sarthak Rawat: a static Next.js site in a quiet, literary style ("paper and pixels") with a few small things to play with.

- **Home:** a koi pond drawn in code behind the intro (feed the fish), live words that open small cards, a record player that plays previews of the songs I'm on repeat with, a reading stack and a pixel clock.
- **Work:** experience and projects from the résumé, interactive architecture diagrams, skills that cross-highlight the work they were used in, and GitHub activity.
- **Library:** a bookshelf you can browse.
- **Footer:** a Japanese maple, grown in code, dropping red leaves onto still water.
- **Header:** a tiny pixel record that switches on generated ambient music.

## Stack

Next.js 16 (App Router, static export) · React 19 · Tailwind CSS 4 · Motion · Canvas and Web Audio, no other runtime dependencies.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script                | What it does                                                    |
| --------------------- | --------------------------------------------------------------- |
| `npm run dev`         | Development server                                              |
| `npm run build`       | Static export to `out/` (refreshes the GitHub snapshot first)   |
| `npm run start`       | Serve `out/` locally                                            |
| `npm run lint`        | ESLint (flat config, `next/core-web-vitals`)                    |
| `npm run format`      | Prettier, whole repo (`format:check` to verify without writing) |
| `npm run sync:github` | Refresh `app/_data/github.json` only (needs `GITHUB_TOKEN`)     |

## Project structure

```
app/
  _components/   UI, grouped by area: home, now, work, library, about, chrome, brand, ui
  _data/         All editable content (see below)
  _lib/          Shared logic: motion tokens, sound engine, song previews, pixel helpers, theme
  _styles/       globals.css: design tokens (Tailwind 4 @theme)
  fonts/         Geist, Departure Mono; Newsreader comes from Google Fonts
  */page.js      Routes: / · /work · /project/[slug] · /about · /library · /blogs
public/          Photos and their 1-bit dithers, project images, illustrations, logo
scripts/         sync-github.mjs (GitHub + npm snapshot)
docs/            anti-slop-checklist.md
DESIGN.md        The design system: tokens, components, motion, rules
```

## Editing content

Everything editable lives in [`app/_data/`](app/_data):

- **`site.js`:** name, summary, availability line, résumé link, socials and skills.
- **`work.js`:** experience and projects. Each project gets a case study at `/project/[slug]`.
- **`library.js`:** books (the shelf and the reading stack) and `records`, the songs shown on the site.
- **`github.json`:** generated snapshot; don't edit by hand.

### Songs

`records` in `library.js` is the list of songs shown, in order. The first one appears in the intro ("listening to …"); the record player flips through all of them. Each song needs a `title` and `artist`. `apple` (the Apple Music song id) and `href` (its Apple Music link) are optional but make previews exact.

Visitors can play a 30-second preview from the record player or the "listening to" card. Previews come from Apple's public iTunes Search API, so there is nothing to configure.

## GitHub activity

The contribution grid, recent repos and npm downloads on `/work` come from a snapshot in `app/_data/github.json`, so the site needs no token at runtime.

- **Contributions:** the last year's contribution calendar (GraphQL API). Private contributions count, without detail, only if "Private contributions" is on in your GitHub profile settings.
- **Repos:** the six most recently pushed public, non-fork repositories.
- **npm:** last month's downloads for each package listed in the script.

`npm run build` refreshes the snapshot when `GITHUB_TOKEN` is set and keeps the existing one when it isn't:

```bash
GITHUB_TOKEN=$(gh auth token) npm run build
```

## Deploying

The build is a fully static site in `out/`, so any static host works. On Vercel:

1. Add a `GITHUB_TOKEN` environment variable (a fine-grained token with read-only access to public repositories) so every deploy ships fresh GitHub numbers.
2. Optionally set `NEXT_PUBLIC_SITE_URL` to your domain (used for the sitemap, robots and social cards).
3. To refresh daily, create a deploy hook and add its URL as the repository secret `DEPLOY_HOOK_URL`; [`.github/workflows/daily-rebuild.yml`](.github/workflows/daily-rebuild.yml) calls it every morning.

## Design

[`DESIGN.md`](DESIGN.md) is the source of truth for tokens, components and motion. Every page should also pass [`docs/anti-slop-checklist.md`](docs/anti-slop-checklist.md). Everything respects `prefers-reduced-motion`, and sound only ever starts from a click.

## Credits

Interaction ideas and UI sounds are adapted from [Bencho](https://github.com/cabralorenzo/bencho) (MIT). Fonts: Newsreader (Production Type, OFL), Geist (Vercel, OFL) and Departure Mono (Tobias Fried, MIT). Song previews and links: Apple Music.
