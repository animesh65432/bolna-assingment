import axios, { AxiosError } from "axios";
import { asyncErrorHandler } from "../asyncerrorhandler";
import { config } from "../config";
import { connectDB } from "../connectdb"

export const callUser = asyncErrorHandler(async (req, res, next) => {
    const {
        phone,
        date,
        period,
        med,
        time,
        name = "Sir",
    } = req.body;

    const [hours, minutes] = time.split(":");
    const callTime = new Date(date);
    callTime.setHours(Number(hours), Number(minutes), 0, 0);

    const scheduled_at = callTime.toISOString();

    const payload = {
        agent_id: config.BOLNA_AGENT_ID,
        recipient_phone_number: `+91${phone}`,
        scheduled_at,
        user_data: {
            date,
            period,
            med,
            time,
            name,
        },
        agent_data: {
            voice_id: "default",
        },
    };

    try {
        const response = await axios.post(
            config.BOLNA_BASE_API_URL,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${config.BOLNA_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // 1. Connect to DB
        const db = await connectDB();


        const reminders = db.collection("reminders");

        await reminders.insertOne({
            phone,
            name,
            date,
            time,
            med,
            period,
            execution_id: response.data.execution_id,
            status: "scheduled",
            adherence: null,
            notes: null,
            scheduled_at,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        return res.status(200).json({
            success: true,
            message: `Call scheduled for ${period} at ${time}`,
            execution_id: response.data.execution_id,
        });
    } catch (rawError) {

        if (axios.isAxiosError(rawError)) {
            const error = rawError as AxiosError;
            console.error(
                "Bolna Axios error:",
                error.response?.status,
                error.response?.data
            );

            return res.status(error.response?.status || 500).json({
                success: false,
                error: error.response?.data || error.message,
            });
        }
        return next(rawError);
    }
});

export const bolnaWebhook = asyncErrorHandler(async (req, res, next) => {
    const { execution_id, status, extracted_data } = req.body;

    const db = await connectDB();
    const reminders = db.collection("reminders");

    const reminder = await reminders.findOne({ execution_id });
    if (!reminder) {
        return res.status(404).json({ error: "Reminder not found" });
    }

    await reminders.updateOne(
        { execution_id },
        {
            $set: {
                status,
                adherence: extracted_data?.adherence ?? null,
                notes: extracted_data?.notes ?? null,
                updated_at: new Date().toISOString(),
            },
        }
    );

    return res.status(200).json({ received: true });
});

export const getReminders = asyncErrorHandler(async (req, res, next) => {
    const { phone } = req.query;

    if (!phone) {
        return res.status(400).json({ error: "phone is required" });
    }

    const db = await connectDB();
    const reminders = db.collection("reminders");

    const data = await reminders
        .find({ phone })
        .sort({ scheduled_at: 1 })
        .toArray();

    return res.status(200).json({ success: true, data });
});