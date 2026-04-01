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
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateannouncements = void 0;
const Groq_1 = require("../services/Groq");
const translateannouncements_1 = require("../prompts/translateannouncements");
const translateannouncements = (announcements, target_lan) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const prompt = (0, translateannouncements_1.Get_Prompt)(announcements, target_lan);
    try {
        const response = yield Groq_1.groq.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "openai/gpt-oss-20b",
            response_format: { type: "json_object" }
        });
        const text = (_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        if (!text) {
            throw new Error("No response content received from API");
        }
        const translatedData = JSON.parse(text);
        if (!translatedData.announcements || !Array.isArray(translatedData.announcements)) {
            throw new Error("Invalid response format: expected announcements array");
        }
        const result = translatedData.announcements.map((item, index) => {
            var _a, _b, _c, _d, _e;
            if (!item.title || !item.link) {
                console.warn(`Missing title or link for announcement at index ${index}`);
            }
            return {
                title: item.title || ((_a = announcements[index]) === null || _a === void 0 ? void 0 : _a.title) || "Untitled",
                link: item.link || ((_b = announcements[index]) === null || _b === void 0 ? void 0 : _b.source) || "",
                _id: item._id || ((_c = announcements[index]) === null || _c === void 0 ? void 0 : _c._id) || "",
                type: item.type || ((_d = announcements[index]) === null || _d === void 0 ? void 0 : _d.type) || "",
                summary: item.content || ((_e = announcements[index]) === null || _e === void 0 ? void 0 : _e.content) || ""
            };
        });
        return result;
    }
    catch (error) {
        console.error("Translation error:", error);
        return announcements;
    }
});
exports.translateannouncements = translateannouncements;
exports.default = exports.translateannouncements;
