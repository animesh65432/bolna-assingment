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
exports.rateLimiter = void 0;
const redis_1 = require("../services/redis");
const rateLimiter = (limit, windowMs) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const ip = req.ip;
        const key = `rate-limit:${ip}`;
        const expireSeconds = Math.floor(windowMs / 1000);
        try {
            const count = yield redis_1.redis.get(key);
            if (count) {
                const current = parseInt(count);
                const ttl = yield redis_1.redis.ttl(key);
                if (ttl === -1) {
                    yield redis_1.redis.expire(key, expireSeconds);
                }
                if (current >= limit) {
                    return res
                        .status(429)
                        .set("Retry-After", `${expireSeconds}`)
                        .json({ message: "Too many requests, please try again later." });
                }
                yield redis_1.redis.incr(key);
            }
            else {
                yield redis_1.redis.set(key, "1", { ex: expireSeconds });
            }
            next();
        }
        catch (error) {
            console.error("Redis rate limiter error:", error);
            next();
        }
    });
};
exports.rateLimiter = rateLimiter;
