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
exports.getSavedAnnouncements = exports.removeSave = exports.addSave = void 0;
const asyncErrorHandler_1 = require("../middleware/asyncErrorHandler");
const db_1 = require("../db");
const redis_1 = require("../services/redis");
const lan_1 = require("../utils/lan");
const mongodb_1 = require("mongodb");
const addSave = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { announcementId } = req.body;
    if (!userId || !announcementId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
        return;
    }
    const db = yield (0, db_1.connectDB)();
    const savesCollection = db.collection("saves");
    const existingSave = yield savesCollection.findOne({
        userId: userId,
        announcementId: announcementId,
    });
    if (existingSave) {
        res.status(400).json({
            success: true,
            message: "Already saved"
        });
        return;
    }
    yield savesCollection.insertOne({
        userId: userId,
        announcementId: announcementId,
    });
    res.json({
        success: true,
        message: "Saved successfully"
    });
    return;
}));
exports.addSave = addSave;
const removeSave = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { announcementId } = req.query;
    if (!userId || !announcementId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
        return;
    }
    const db = yield (0, db_1.connectDB)();
    const savesCollection = db.collection("saves");
    yield savesCollection.deleteOne({
        userId: userId,
        announcementId: announcementId,
    });
    res.json({
        success: true,
        message: "Removed from saves successfully"
    });
    return;
}));
exports.removeSave = removeSave;
const getSavedAnnouncements = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { page = 1, limit = 10, lan } = req.query;
    if (!userId || !lan) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
        return;
    }
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const targetLanguage = lan_1.LANGUAGE_CODES[lan] || "en";
    const redis_key = `SavedAnnouncements_${userId}_${targetLanguage}_page${page}_limit${limit}`;
    const cached_data = yield redis_1.redis.get(redis_key);
    if (cached_data && typeof cached_data === "string") {
        res.status(200).json(JSON.parse(cached_data));
        return;
    }
    const db = yield (0, db_1.connectDB)();
    const savesCollection = db.collection("saves");
    const savedRecords = yield savesCollection
        .find({ userId: new mongodb_1.ObjectId(userId) })
        .toArray();
    const announcementIds = savedRecords.map(save => new mongodb_1.ObjectId(save.announcementId));
    if (announcementIds.length === 0) {
        const emptyResponse = {
            success: true,
            data: [],
            pagination: {
                page: pageNumber,
                totalPages: 0,
                totalCount: 0,
                pageSize,
            },
        };
        yield redis_1.redis.set(redis_key, JSON.stringify(emptyResponse), { ex: 300 });
        res.status(200).json(emptyResponse);
        return;
    }
    const announcements = yield db.collection("Translated_Announcements")
        .find({
        announcementId: { $in: announcementIds },
        language: targetLanguage
    }, {
        projection: {
            sections: 0,
            language: 0,
            source_link: 0,
            _id: 0
        }
    })
        .sort({ date: -1, _id: -1 })
        .skip(skip)
        .limit(pageSize)
        .toArray();
    const totalCount = yield db.collection("Translated_Announcements")
        .countDocuments({
        announcementId: { $in: announcementIds },
        language: targetLanguage
    });
    const totalPages = Math.ceil(totalCount / pageSize);
    const responseData = {
        success: true,
        data: announcements,
        pagination: {
            page: pageNumber,
            totalPages,
            totalCount,
            pageSize,
        },
    };
    yield redis_1.redis.set(redis_key, JSON.stringify(responseData), { ex: 300 });
    res.status(200).json(responseData);
    return;
}));
exports.getSavedAnnouncements = getSavedAnnouncements;
