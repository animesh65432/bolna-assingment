import React, { useState } from "react"
import { ReminderInput, Period } from "@/types"
import { PERIODS, ICONS } from "@/constants"
import { todayStr } from "@/helpers"
import Icon from "./Icon"
interface AddReminderModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (input: ReminderInput) => Promise<void>
    IsLoading: boolean
}

const AddReminderModal = ({ open, onClose, onSubmit, IsLoading }: AddReminderModalProps) => {
    const [form, setForm] = useState<ReminderInput>({ date: todayStr(), time: "08:00", med: "", period: "morning" })
    const [loading, setLoading] = useState(false)

    const setField = (field: keyof ReminderInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }))

    const handleSubmit = async () => {
        if (!form.med.trim()) return
        setLoading(true)
        await onSubmit(form)
        setLoading(false)
        setForm({ date: todayStr(), time: "08:00", med: "", period: "morning" })
        onClose()
    }

    if (!open) return null

    const canSubmit = !!form.med.trim() && !loading

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">

                {/* header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-playfair text-xl font-bold text-slate-100">New Reminder</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-slate-400">
                        <Icon path={ICONS.close} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* medicine name */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Medicine Name</label>
                        <input
                            value={form.med} onChange={setField("med")}
                            placeholder="e.g. Metformin 500mg"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-violet-500 focus:bg-violet-500/5 transition-all"
                        />
                    </div>

                    {/* period */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Period</label>
                        <div className="grid grid-cols-4 gap-2">
                            {(Object.keys(PERIODS) as Period[]).map(p => (
                                <button key={p} onClick={() => setForm(f => ({ ...f, period: p }))}
                                    className={`py-2.5 rounded-xl text-xs font-medium transition-all border ${form.period === p
                                        ? `${PERIODS[p].bg} ${PERIODS[p].accent} ${PERIODS[p].border}`
                                        : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                                        }`}>
                                    {PERIODS[p].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* date & time */}
                    <div className="grid grid-cols-2 gap-3">
                        {(["date", "time"] as const).map(field => (
                            <div key={field}>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">{field}</label>
                                <input
                                    type={field} value={form[field]} onChange={setField(field)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-slate-100 outline-none focus:border-violet-500 transition-all [color-scheme:dark]"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* submit */}
                <button onClick={handleSubmit} disabled={!canSubmit}
                    className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all ${canSubmit
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-white/5 text-slate-600 cursor-not-allowed border border-white/10"
                        }`}>
                    {loading
                        ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        : <><Icon path={ICONS.plus} /> <span>Schedule Call Reminder</span></>
                    }
                </button>
            </div>
        </div>
    )
}

export default AddReminderModal