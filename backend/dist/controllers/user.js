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
exports.googleAuth = void 0;
const connectdb_1 = require("../connectdb");
const googleClient_1 = require("../services/googleClient");
const createtoken_1 = require("../utils/createtoken");
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { credential, clientId } = req.body;
    if (!credential || !clientId) {
        return res.status(400).json({
            success: false,
            message: "Credential and clientId are required",
        });
    }
    const ticket = yield googleClient_1.googleclient.verifyIdToken({
        idToken: credential,
        audience: clientId,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
        return res.status(401).json({
            success: false,
            message: "Invalid Google token",
        });
    }
    if (!payload.email_verified) {
        return res.status(401).json({
            success: false,
            message: "Google email is not verified",
        });
    }
    const { email, name, picture } = payload;
    const db = yield (0, connectdb_1.connectDB)();
    const usersCollection = db.collection("users");
    let user = yield usersCollection.findOne({ email });
    let isNewUser = false;
    if (!user) {
        const result = yield usersCollection.insertOne({
            email,
            name: name || "",
            avatar: picture || "",
            provider: "google",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        user = {
            _id: result.insertedId,
            email,
            name,
            avatar: picture,
            provider: "google",
        };
        isNewUser = true;
    }
    else {
        yield usersCollection.updateOne({ _id: user._id }, {
            $set: {
                name: name || user.name,
                avatar: picture || user.avatar,
                updatedAt: new Date(),
            },
        });
    }
    const token = (0, createtoken_1.createToken)(email);
    return res.status(isNewUser ? 201 : 200).json({
        success: true,
        message: isNewUser
            ? "Google account created successfully"
            : "Logged in successfully",
        token,
        user: {
            id: user._id,
            email,
            name,
            avatar: picture,
        },
    });
});
exports.googleAuth = googleAuth;
