"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sarvamai = void 0;
const sarvamai_1 = require("sarvamai");
const config_1 = __importDefault(require("../config"));
exports.sarvamai = new sarvamai_1.SarvamAIClient({ apiSubscriptionKey: config_1.default.SARVAMAI });
