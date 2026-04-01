"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ratelimiter_1 = require("../../middleware/ratelimiter");
const alerts_1 = require("../../controllers/alerts");
const router = (0, express_1.Router)();
router.use((0, ratelimiter_1.rateLimiter)(20, 60000));
router.post("/addsubscribe", alerts_1.AddSubscribe);
exports.default = router;
