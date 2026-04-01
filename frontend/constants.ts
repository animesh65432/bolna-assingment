import { Period, Status } from "./types"

export const PERIODS: Record<Period, { label: string; accent: string; bg: string; border: string }> = {
    morning: { label: "Morning", accent: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    afternoon: { label: "Afternoon", accent: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
    evening: { label: "Evening", accent: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    night: { label: "Night", accent: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
}

export const STATUSES: Record<Status, { label: string; dot: string; badge: string }> = {
    scheduled: { label: "Scheduled", dot: "bg-sky-400", badge: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    completed: { label: "Completed", dot: "bg-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    missed: { label: "Missed", dot: "bg-rose-400", badge: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    pending: { label: "Pending", dot: "bg-amber-400", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
}

export const TABS = [
    { key: "today" as const, label: "Today" },
    { key: "upcoming" as const, label: "Upcoming" },
    { key: "all" as const, label: "All" },
]

export const ICONS = {
    pill: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
    plus: "M12 4.5v15m7.5-7.5h-15",
    clock: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
    close: "M6 18L18 6M6 6l12 12",
    signout: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75",
    bell: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
    check: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    chart: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
    calendar: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5",
}