"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.post("/call", controllers_1.callUser);
router.post("/bolna-webhook", controllers_1.bolnaWebhook);
router.get("/reminders", controllers_1.getReminders);
exports.default = router;
