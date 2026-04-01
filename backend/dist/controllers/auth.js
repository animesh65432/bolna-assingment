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
exports.auth = void 0;
const asyncErrorHandler_1 = require("../middleware/asyncErrorHandler");
const db_1 = require("../db");
const createToken_1 = require("../utils/createToken");
exports.auth = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({
            success: false,
            message: "Name and email are required"
        });
        return;
    }
    const token = (0, createToken_1.createToken)(email);
    const db = yield (0, db_1.connectDB)();
    const usersCollection = db.collection("users");
    const existingUser = yield usersCollection.findOne({ email });
    if (existingUser) {
        res.status(200).json({
            success: true,
            message: "User already exists",
            token
        });
        return;
    }
    const newUser = {
        name,
        email
    };
    yield usersCollection.insertOne(newUser);
    res.status(200).json({
        success: true,
        message: "User created successfully",
        token
    });
    return;
}));
