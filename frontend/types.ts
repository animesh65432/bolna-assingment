export type Period = "morning" | "afternoon" | "evening" | "night"
export type Status = "scheduled" | "completed" | "missed" | "pending"

export interface Reminder {
    execution_id?: string
    phone: string
    name: string
    date: string
    time: string
    med: string
    period: Period
    status: Status
    adherence: boolean | null
    notes: string | null
    scheduled_at: string
    created_at: string
}

export type ReminderInput = Pick<Reminder, "date" | "time" | "med" | "period">