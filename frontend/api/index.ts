import { Call } from "@/service/call"

export const callUser = async (input: { phone: string, name: string, date: string, time: string, medication: string }) => {
    return Call({
        path: "/call",
        method: "POST",
        request: {
            ...input
        }
    })
}

export const getReminders = async (phone: string) => {
    return Call({
        path: `/reminders?phone=${phone}`,
        method: "GET",
    })
}