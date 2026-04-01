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
exports.AddSubscribe = void 0;
const asyncErrorHandler_1 = require("../middleware/asyncErrorHandler");
const aleart_1 = require("../db/aleart");
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: config_1.default.EMAIL_USER,
        pass: config_1.default.EMAIL_PASS,
    },
});
exports.AddSubscribe = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email } = req.body;
    if (!Email) {
        res.status(400).json({
            message: "Email is required"
        });
        return;
    }
    const SubscribeDb = yield (0, aleart_1.connectDB)();
    const checkalreadysubscribe = yield SubscribeDb.collection("Subscribe").findOne({ Email });
    if (checkalreadysubscribe) {
        res.status(409).json({
            message: "Email is already subscribed"
        });
        return;
    }
    yield SubscribeDb.collection("Subscribe").insertOne({ Email });
    const mailOptions = {
        from: config_1.default.EMAIL_USER,
        to: Email,
        subject: "Thank you for subscribing to indiangovtoday.app!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px 0;">
              <img src="https://indiangovtoday.app/Logo.png" alt="Indian Gov Today Logo" style="max-width: 200px; height: auto;" />
            </div>
            <h1 style="color: #333;">Hello!</h1>
            <p>Thank you for subscribing to our updates on <strong>theseindiangovtoday.app</strong>.</p>
            <p>We'll keep you informed about important Indian government announcements.</p>
            <p>Best regards,<br>The team at indiangovtoday.app</p>
          </div>
        `,
    };
    yield transporter.sendMail(mailOptions);
    res.status(201).json({
        message: "Successfully subscribed"
    });
    return;
}));
