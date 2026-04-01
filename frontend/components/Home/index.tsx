import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "@/context/user"
import { Reminder, ReminderInput } from "@/types"
import { ICONS, TABS } from "@/constants"
import { todayStr, greeting } from "@/helpers"
import Icon from "@/components/Icon"
import StatCard from "@/components/StatCard"
import NextReminderBanner from "@/components/NextReminderBanner"
import ReminderCard from "@/components/ReminderCard"
import { getReminders, callUser } from "@/api/index"
import EmptyState from "@/components/EmptyState"
import AddReminderModal from "@/components/AddReminderModal"


const Logo = () => (
    <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Icon path={ICONS.pill} className="w-4 h-4 text-white" />
        </div>
        <span className="font-playfair text-slate-100 text-base font-semibold">MedPing</span>
    </div>
)


const Home: React.FC = () => {
    const { user, onLogout } = useContext(UserContext)!
    const [remindersLoading, setRemindersLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "all">("today")
    const [showModal, setShowModal] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const today = todayStr()

    async function fetchReminders() {
        setRemindersLoading(true)
        const response = await getReminders(user?.phoneNumber || "") as { data: Reminder[] }
        setReminders(response.data)
        setRemindersLoading(false)
    }

    useEffect(() => {
        fetchReminders()
    }, [user?.phoneNumber])

    // ── Derived state ──────────────────────────────────────────────────────────
    const todayReminders = reminders.filter(r => r.date === today)
    const completedCount = todayReminders.filter(r => r.status === "completed").length
    const adherenceRate = todayReminders.length
        ? Math.round(todayReminders.filter(r => r.adherence === true).length / todayReminders.length * 100)
        : 0
    const nextReminder = reminders.find(r => r.status === "scheduled" || r.status === "pending")
    const upcomingCount = reminders.filter(r => r.date > today).length

    const filteredReminders = reminders.filter(r =>
        activeTab === "today" ? r.date === today :
            activeTab === "upcoming" ? r.date > today : true
    )

    const stats = [
        { icon: ICONS.check, value: `${completedCount}/${todayReminders.length}`, label: "Today's Doses", accent: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { icon: ICONS.chart, value: `${adherenceRate}%`, label: "Adherence", accent: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
        { icon: ICONS.calendar, value: String(upcomingCount), label: "Upcoming", accent: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
    ]

    // ── Handlers ───────────────────────────────────────────────────────────────
    const handleAdd = async (input: ReminderInput) => {
        try {
            setIsLoading(true)
            const response = await callUser({
                ...input,
                phone: user?.phoneNumber || "",
                name: user?.name || "",
                medication: input.med.trim()
            }) as { execution_id: string }

            const execution_id = response.execution_id
            const scheduledAt = new Date(`${input.date}T${input.time}`).toISOString()

            const newReminder: Reminder = {
                ...input,
                execution_id,
                phone: user?.phoneNumber || "",
                name: user?.name || "",
                status: "scheduled",
                adherence: null,
                notes: null,
                scheduled_at: scheduledAt,
                created_at: new Date().toISOString(),
            }
            setReminders(prev => [newReminder, ...prev])
        } catch (error) {
            console.error("Failed to add reminder:", error)
            alert("Failed to add reminder. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="font-dm min-h-screen bg-slate-950 text-slate-100">

            {/* ambient blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl" />
            </div>

            {/* ── Header ── */}
            <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.06]">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Logo />

                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(m => !m)}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-semibold text-violet-300 hover:border-violet-400/50 transition-all"
                        >
                            {(user?.name || "U")[0].toUpperCase()}
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-10 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-1 w-44 z-50">
                                <div className="px-3 py-2 border-b border-white/5 mb-1">
                                    <p className="text-xs font-medium text-slate-200 truncate">{user?.name}</p>
                                    <p className="text-xs text-slate-500">{user?.phoneNumber}</p>
                                </div>
                                <button
                                    onClick={() => { setMenuOpen(false); onLogout?.() }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                                >
                                    <Icon path={ICONS.signout} className="w-3.5 h-3.5" />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">

                {/* greeting */}
                <div>
                    <p className="text-violet-400 text-xs font-medium tracking-widest uppercase">{greeting()}</p>
                    <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-100 mt-0.5">
                        {user?.name || "Friend"} 👋
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Here's your medication schedule.</p>
                </div>

                {/* stats */}
                <div className="grid grid-cols-3 gap-3">
                    {stats.map(s => <StatCard key={s.label} {...s} />)}
                </div>

                {/* next reminder */}
                {nextReminder && <NextReminderBanner reminder={nextReminder} />}

                {/* tabs + add */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                        {TABS.map(t => (
                            <button key={t.key} onClick={() => setActiveTab(t.key)}
                                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === t.key ? "bg-white/10 text-slate-100" : "text-slate-500 hover:text-slate-300"
                                    }`}>
                                {t.label}
                                {t.key === "today" && todayReminders.length > 0 && (
                                    <span className="ml-1.5 bg-violet-500/30 text-violet-300 text-[10px] px-1.5 py-0.5 rounded-full">
                                        {todayReminders.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-medium px-3 sm:px-4 py-2 rounded-xl shadow-lg shadow-violet-500/25 hover:scale-[1.03] active:scale-[0.97] transition-all">
                        <Icon path={ICONS.plus} className="w-3.5 h-3.5" />
                        Add
                    </button>
                </div>

                {/* list */}
                {filteredReminders.length === 0
                    ? <EmptyState onAdd={() => setShowModal(true)} />
                    : (
                        <div className="space-y-2.5">
                            {filteredReminders.map((r, i) => <ReminderCard key={r.execution_id ?? i} reminder={r} />)}
                        </div>
                    )
                }
            </main>

            {/* mobile FAB */}
            <button onClick={() => setShowModal(true)}
                className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/40 hover:scale-105 active:scale-95 transition-all z-20">
                <Icon path={ICONS.plus} className="w-6 h-6 text-white" />
            </button>

            <AddReminderModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAdd}
                IsLoading={isLoading}
            />
        </div>
    )
}

export default Home