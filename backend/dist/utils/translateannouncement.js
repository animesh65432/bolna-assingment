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
exports.translateannouncement = void 0;
const Groq_1 = require("../services/Groq");
const translateannouncement_1 = require("../prompts/translateannouncement");
const translateannouncement = (announcement, target_lan) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const prompt = (0, translateannouncement_1.Get_propmt)(announcement.content, announcement.title, announcement._id, announcement.source, target_lan);
    try {
        const response = yield Groq_1.groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "openai/gpt-oss-20b",
            response_format: { type: "json_object" }
        });
        const text = (_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        console.log(text);
        if (!text) {
            throw new Error("No response content received from API");
        }
        const translatedData = JSON.parse(text);
        if (!translatedData.title || !translatedData.content) {
            throw new Error("Invalid response format: missing required fields");
        }
        return {
            title: translatedData.title,
            content: translatedData.content,
            _id: announcement._id,
            source: announcement.source
        };
    }
    catch (error) {
        console.error("Translation error:", error);
        return announcement;
    }
});
exports.translateannouncement = translateannouncement;
