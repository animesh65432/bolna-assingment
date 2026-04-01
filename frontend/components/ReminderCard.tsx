import { Reminder } from "@/types"
import { PERIODS, STATUSES, ICONS } from "@/constants"
import Icon from "./Icon"

const ReminderCard = ({ reminder }: { reminder: Reminder }) => {
    const p = PERIODS[reminder.period]
    const s = STATUSES[reminder.status]

    return (
        <div className="flex items-start gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] rounded-2xl p-4 transition-colors">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${p.bg} ${p.border}`}>
                <Icon path={ICONS.pill} className={`w-5 h-5 ${p.accent}`} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-100 text-sm font-medium truncate">{reminder.med}</p>
                    <span className={`shrink-0 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${s.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                    </span>
                </div>

                <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Icon path={ICONS.clock} className="w-3 h-3" />
                        {reminder.time}
                    </span>
                    <span className="text-slate-600 text-xs">{p.label}</span>
                    {reminder.adherence !== null && (
                        <span className={`text-xs ${reminder.adherence ? "text-emerald-400" : "text-rose-400"}`}>
                            {reminder.adherence ? "✓ Taken" : "✗ Missed"}
                        </span>
                    )}
                </div>

                {reminder.notes && (
                    <p className="mt-1.5 text-xs text-slate-600 italic truncate">"{reminder.notes}"</p>
                )}
            </div>
        </div>
    )
}

export default ReminderCard