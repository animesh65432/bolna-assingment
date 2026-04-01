"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const redis_1 = require("@upstash/redis");
const config_1 = __importDefault(require("../config"));
exports.redis = new redis_1.Redis({
    url: config_1.default.UPSTASH_REDIS_REST_URL,
    token: config_1.default.UPSTASH_REDIS_REST_TOKEN,
});
