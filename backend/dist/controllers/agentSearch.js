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
exports.searchAgent = void 0;
const asyncErrorHandler_1 = require("../middleware/asyncErrorHandler");
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
exports.searchAgent = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    if (!query || query.trim() === '') {
        res.status(400).json({ success: false, error: "Query is required" });
        return;
    }
    const response = yield axios_1.default.post(`${config_1.default.BOLNA_BASE_URL}/v2/agent/${config_1.default.BOLNA_AGENT_ID}/executions`, {
        user_input: query
    }, {
        headers: {
            Authorization: `Bearer ${config_1.default.BOLNA_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    const Payloaddata = response.data;
    res.status(200).json({
        success: true,
        payload: Payloaddata
    });
    return;
}));
