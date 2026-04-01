import { Reminder } from "@/types"
import { PERIODS, ICONS } from "@/constants"
import { todayStr } from "@/helpers"
import Icon from "./Icon"

const NextReminderBanner = ({ reminder }: { reminder: Reminder }) => {
    const p = PERIODS[reminder.period]
    const dateLabel = reminder.date === todayStr() ? "Today" : "Tomorrow"

    return (
        <div className={`rounded-2xl border p-4 sm:p-5 ${p.bg} ${p.border} flex items-center gap-4`}>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Icon path={ICONS.bell} className={`w-6 h-6 ${p.accent}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Next Reminder</p>
                <p className="text-slate-100 font-semibold text-sm mt-0.5 truncate">{reminder.med}</p>
                <p className={`text-xs mt-0.5 ${p.accent}`}>{p.label} · {reminder.time} · {dateLabel}</p>
            </div>
            <Icon path={ICONS.bell} className={`w-5 h-5 ${p.accent} shrink-0`} />
        </div>
    )
}

export default NextReminderBanner