"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiAI = void 0;
const genai_1 = require("@google/genai");
const config_1 = __importDefault(require("../config"));
exports.GeminiAI = new genai_1.GoogleGenAI({
    apiKey: config_1.default.GEMINI_API_KEY
});
