"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReminders = exports.bolnaWebhook = exports.callUser = void 0;
const axios_1 = __importDefault(require("axios"));
const asyncerrorhandler_1 = require("../asyncerrorhandler");
const config_1 = require("../config");
const connectdb_1 = require("../connectdb");
exports.callUser = (0, asyncerrorhandler_1.asyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { phone, date, period, med, time, name = "Sir", } = req.body;
    const [hours, minutes] = time.split(":");
    const callTime = new Date(date);
    callTime.setHours(Number(hours), Number(minutes), 0, 0);
    const scheduled_at = callTime.toISOString();
    const payload = {
        agent_id: config_1.config.BOLNA_AGENT_ID,
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
        const response = yield axios_1.default.post(config_1.config.BOLNA_BASE_API_URL, payload, {
            headers: {
                Authorization: `Bearer ${config_1.config.BOLNA_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        // 1. Connect to DB
        const db = yield (0, connectdb_1.connectDB)();
        const reminders = db.collection("reminders");
        yield reminders.insertOne({
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
    }
    catch (rawError) {
        if (axios_1.default.isAxiosError(rawError)) {
            const error = rawError;
            console.error("Bolna Axios error:", (_a = error.response) === null || _a === void 0 ? void 0 : _a.status, (_b = error.response) === null || _b === void 0 ? void 0 : _b.data);
            return res.status(((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500).json({
                success: false,
                error: ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message,
            });
        }
        return next(rawError);
    }
}));
exports.bolnaWebhook = (0, asyncerrorhandler_1.asyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { execution_id, status, extracted_data } = req.body;
    const db = yield (0, connectdb_1.connectDB)();
    const reminders = db.collection("reminders");
    const reminder = yield reminders.findOne({ execution_id });
    if (!reminder) {
        return res.status(404).json({ error: "Reminder not found" });
    }
    yield reminders.updateOne({ execution_id }, {
        $set: {
            status,
            adherence: (_a = extracted_data === null || extracted_data === void 0 ? void 0 : extracted_data.adherence) !== null && _a !== void 0 ? _a : null,
            notes: (_b = extracted_data === null || extracted_data === void 0 ? void 0 : extracted_data.notes) !== null && _b !== void 0 ? _b : null,
            updated_at: new Date().toISOString(),
        },
    });
    return res.status(200).json({ received: true });
}));
exports.getReminders = (0, asyncerrorhandler_1.asyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.query;
    if (!phone) {
        return res.status(400).json({ error: "phone is required" });
    }
    const db = yield (0, connectdb_1.connectDB)();
    const reminders = db.collection("reminders");
    const data = yield reminders
        .find({ phone })
        .sort({ scheduled_at: 1 })
        .toArray();
    return res.status(200).json({ success: true, data });
}));
