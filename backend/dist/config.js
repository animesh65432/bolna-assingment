"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
exports.config = {
    PORT: process.env.PORT || 3000,
    BOLNA_BASE_API_URL: "https://api.bolna.ai/call",
    BOLNA_API_KEY: process.env.BOLNA_API_KEY || "",
    BOLNA_AGENT_ID: process.env.BOLNA_AGENT_ID || "",
    DATABASE_URL: process.env.DATABASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || ""
};
