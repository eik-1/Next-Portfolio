// Dates in github.json are plain "YYYY-MM-DD" strings. They are formatted by
// hand (no Intl, no local timezone) so the server and the browser always agree.

const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]
const MONTHS_LONG = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const WEEKDAYS_LONG = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

/** "2026-11-17" → { y: 2026, m: 10, d: 17, wd: 2 } (month and weekday are 0-based, Sunday = 0). */
export function parseDay(iso) {
    const [y, m, d] = iso.split("-").map(Number)
    return { y, m: m - 1, d, wd: new Date(Date.UTC(y, m - 1, d)).getUTCDay() }
}

/** "17 Nov" */
export function dayMonth(iso) {
    const t = parseDay(iso)
    return `${t.d} ${MONTHS[t.m]}`
}

/** "17 Nov 2026" */
export function dayMonthYear(iso) {
    return `${dayMonth(iso)} ${parseDay(iso).y}`
}

/** "Tue 17 Nov" */
export function weekdayDayMonth(iso) {
    return `${WEEKDAYS[parseDay(iso).wd]} ${dayMonth(iso)}`
}

/** "Tuesday 17 November 2026", for screen readers. */
export function longDate(iso) {
    const t = parseDay(iso)
    return `${WEEKDAYS_LONG[t.wd]} ${t.d} ${MONTHS_LONG[t.m]} ${t.y}`
}

/** 1204 → "1,204" */
export function count(n) {
    return n.toLocaleString("en-US")
}

/** 0 → "No contributions", 1 → "1 contribution", 4 → "4 contributions" */
export function contributions(n) {
    if (n === 0) return "No contributions"
    return n === 1 ? "1 contribution" : `${count(n)} contributions`
}
