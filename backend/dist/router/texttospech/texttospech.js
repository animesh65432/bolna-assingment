"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const texttospech_1 = require("../../controllers/texttospech");
const ratelimiter_1 = require("../../middleware/ratelimiter");
const texttospech = (0, express_1.Router)();
texttospech.use((0, ratelimiter_1.rateLimiter)(10, 60000));
texttospech.post("/texttospech", texttospech_1.translateSpeech);
exports.default = texttospech;
