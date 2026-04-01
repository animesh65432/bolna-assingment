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
exports.translateSpeech = void 0;
const SarvamAi_1 = require("../services/SarvamAi");
const asyncErrorHandler_1 = require("../middleware/asyncErrorHandler");
const lan_1 = require("../utils/lan");
exports.translateSpeech = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, target_language } = req.body;
    if (!text || !target_language) {
        res.status(400).json({ message: "Text and target_language are required" });
        return;
    }
    const target_language_code = lan_1.languageCodeMap[target_language];
    if (!target_language_code) {
        res.status(400).json({
            message: "Unsupported language",
            supportedLanguages: Object.keys(lan_1.languageCodeMap)
        });
        return;
    }
    const response = yield SarvamAi_1.sarvamai.textToSpeech.convert({
        text: text,
        target_language_code: `${target_language_code}-IN`,
    });
    res.status(200).json({
        success: true,
        message: "Text converted to speech successfully",
        audioContent: response.audios[0],
        language: target_language,
        languageCode: target_language_code
    });
    return;
}));
