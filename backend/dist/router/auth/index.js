"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../controllers/auth");
const ratelimiter_1 = require("../../middleware/ratelimiter");
const router = (0, express_1.Router)();
router.use((0, ratelimiter_1.rateLimiter)(25, 60000));
router.post("/auth", auth_1.auth);
exports.default = router;
