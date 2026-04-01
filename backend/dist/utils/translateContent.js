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
exports.translateContent = void 0;
const GeminiAi_1 = require("../services/GeminiAi");
const translateContent_1 = require("../prompts/translateContent");
const translateContent = (content, target_lan) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const prompt = (0, translateContent_1.Get_propmt)(content, target_lan);
        const response = yield GeminiAi_1.GeminiAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return (_a = response.text) !== null && _a !== void 0 ? _a : null;
    }
    catch (error) {
        console.error("Translation error:", error);
        return null;
    }
});
exports.translateContent = translateContent;
