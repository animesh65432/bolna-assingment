import { Reminder } from "./types"

const istHour = () => {
    return Number(new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hour12: false
    }))
}

export const todayStr = () => {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
}

export const tomorrowStr = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
}

export const greeting = () => {
    const h = istHour()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    if (h < 21) return "Good evening"
    return "Good night"
}

// Replace with: useEffect(() => fetch(`/api/reminders?phone=${user.phoneNumber}`).then(...), [])
export const MOCK_REMINDERS: Reminder[] = [
    { execution_id: "1", phone: "", name: "", date: todayStr(), time: "08:00", med: "Metformin 500mg", period: "morning", status: "completed", adherence: true, notes: "Taken with breakfast", scheduled_at: "", created_at: "" },
    { execution_id: "2", phone: "", name: "", date: todayStr(), time: "14:00", med: "Amlodipine 5mg", period: "afternoon", status: "scheduled", adherence: null, notes: null, scheduled_at: "", created_at: "" },
    { execution_id: "3", phone: "", name: "", date: todayStr(), time: "21:00", med: "Atorvastatin 10mg", period: "night", status: "pending", adherence: null, notes: null, scheduled_at: "", created_at: "" },
    { execution_id: "4", phone: "", name: "", date: tomorrowStr(), time: "08:00", med: "Metformin 500mg", period: "morning", status: "scheduled", adherence: null, notes: null, scheduled_at: "", created_at: "" },
]