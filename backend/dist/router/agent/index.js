"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agentSearch_1 = require("../../controllers/agentSearch");
const router = (0, express_1.Router)();
router.post("/searchAgent", agentSearch_1.searchAgent);
exports.default = router;
