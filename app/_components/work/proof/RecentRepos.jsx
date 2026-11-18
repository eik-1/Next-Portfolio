import github from "@/app/_data/github.json"

import { dayMonth, dayMonthYear, parseDay } from "./format"

const MAX_ROWS = 6

/**
 * The repositories I pushed to most recently: name, one line, language and
 * the date of the last push. Each row opens the repository on GitHub.
 */
export default function RecentRepos({ className, limit = MAX_ROWS }) {
    const repos = [...github.repos]
        .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt))
        .slice(0, Math.min(limit, MAX_ROWS))
    const thisYear = parseDay(github.syncedAt).y

    return (
        <div className={className}>
            <p className="mb-1 flex items-baseline justify-between gap-4 font-sans text-ui text-faint">
                <span>Recently pushed public repos</span>
                <a
                    href={`https://github.com/${github.user}?tab=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-ink"
                >
                    github.com/{github.user} ↗
                </a>
            </p>
            <ul aria-label="Recently pushed repositories" className="-mx-3">
                {repos.map((repo) => (
                    <li key={repo.name}>
                        <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 rounded-md px-3 py-2 font-sans text-ui transition-colors duration-[var(--duration-quick)] ease-[var(--ease-standard)] hover:bg-tile sm:grid-cols-[minmax(0,auto)_minmax(0,1fr)_auto]"
                        >
                            <span className="truncate text-ink">
                                {repo.name}
                            </span>
                            {repo.description ? (
                                <span className="col-span-2 row-start-2 truncate text-soft sm:col-span-1 sm:col-start-2 sm:row-start-1">
                                    {repo.description}
                                </span>
                            ) : null}
                            <span className="col-start-2 row-start-1 whitespace-nowrap font-pixel text-pixel text-faint sm:col-start-3">
                                {repo.language ? `${repo.language} · ` : null}
                                <time dateTime={repo.pushedAt}>
                                    {parseDay(repo.pushedAt).y === thisYear
                                        ? dayMonth(repo.pushedAt)
                                        : dayMonthYear(repo.pushedAt)}
                                </time>
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
