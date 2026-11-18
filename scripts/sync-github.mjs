#!/usr/bin/env node
/**
 * Snapshot public GitHub + npm data into app/_data/github.json.
 * The site is a static export, so this runs before a build instead of at request time.
 *
 *   GITHUB_TOKEN=$(gh auth token) node scripts/sync-github.mjs
 *
 * `npm run build` calls it with --optional (the "prebuild" script): with a token
 * it refreshes the snapshot; without one, or if GitHub is unreachable, it keeps
 * the committed snapshot and the build carries on.
 *
 * Contributions: GitHub's calendar, private ones included as anonymous counts
 * (needs "Private contributions" switched on in your GitHub profile settings,
 * otherwise only public ones are counted). Repos: your 6 most recently pushed
 * public, non-fork repositories. npm: last month's downloads per package.
 */
import { writeFile } from "node:fs/promises"

const USER = "eik-1"
const NPM = ["buildr-stack"]
const optional = process.argv.includes("--optional")
const token = process.env.GITHUB_TOKEN
const bail = (why) => {
    if (!optional) {
        console.error(why)
        process.exit(1)
    }
    console.log(`github.json: kept the existing snapshot (${why})`)
    process.exit(0)
}
if (!token) bail("set GITHUB_TOKEN, e.g. GITHUB_TOKEN=$(gh auth token)")
const gh = (query) =>
    fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            authorization: `bearer ${token}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({ query }),
    }).then((r) => r.json())

const { data, errors } = await gh(`query {
  user(login: "${USER}") {
    contributionsCollection {
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
    }
    repositories(first: 6, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes { name description url pushedAt stargazerCount primaryLanguage { name } }
    }
  }
}`).catch((e) => ({ errors: [e] }))
if (errors || !data?.user)
    bail(`GitHub request failed: ${errors?.[0]?.message ?? "no data"}`)
const cal = data.user.contributionsCollection.contributionCalendar
const npm = await Promise.all(
    NPM.map(async (name) => {
        const r = await fetch(
            `https://api.npmjs.org/downloads/point/last-month/${name}`,
        )
            .then((x) => x.json())
            .catch(() => ({}))
        return {
            name,
            downloadsLastMonth: r.downloads ?? 0,
            url: `https://www.npmjs.com/package/${name}`,
        }
    }),
)
const out = {
    user: USER,
    syncedAt: new Date().toISOString().slice(0, 10),
    total: cal.totalContributions,
    // one array per week, Sunday → Saturday; values are daily contribution counts
    weeks: cal.weeks.map((w) =>
        w.contributionDays.map((d) => [d.date, d.contributionCount]),
    ),
    repos: data.user.repositories.nodes.map((r) => ({
        name: r.name,
        description: r.description,
        url: r.url,
        pushedAt: r.pushedAt.slice(0, 10),
        stars: r.stargazerCount,
        language: r.primaryLanguage?.name ?? null,
    })),
    npm,
}
await writeFile(
    new URL("../app/_data/github.json", import.meta.url),
    JSON.stringify(out, null, 1) + "\n",
)
console.log(
    `github.json: ${out.total} contributions, ${out.repos.length} repos, synced ${out.syncedAt}`,
)
