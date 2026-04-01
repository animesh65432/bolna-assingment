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
exports.GetStats = exports.GetAllCategoriesAnnouncements = exports.GetAllCountAnnouncements = exports.GetAllTrendingTitles = exports.GetallAnnoucementsDepartments = exports.GetIndiaAnnouncement = exports.SerachallIndiaAnnouncements = exports.GetIndiaAnnouncements = void 0;
const asyncErrorHandler_1 = require("../middleware/asyncErrorHandler");
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
const redis_1 = require("../services/redis");
const lan_1 = require("../utils/lan");
const translatePayloadAnnoucements_1 = require("../utils/translatePayloadAnnoucements");
exports.GetIndiaAnnouncements = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, target_lan, startDate, endDate, page, limit, states } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const selectedStates = (0, translatePayloadAnnoucements_1.PrasePayloadArray)(states);
    const sortedStates = [...selectedStates].sort();
    const stateCachePart = sortedStates.join(",");
    const Category = category ? category.toString().trim() : "";
    const announcementsStartDate = startDate
        ? new Date(startDate)
        : new Date(new Date().setDate(new Date().getDate() - 7));
    const announcementsEndDate = endDate ? new Date(endDate) : new Date();
    const targetLanguage = lan_1.LANGUAGE_CODES[target_lan] || "en";
    const redis_key = `Announcements_${targetLanguage}_${announcementsStartDate.toISOString().split('T')[0]}_${announcementsEndDate.toISOString().split('T')[0]}_page${page}_limit${limit}_${Category}_${stateCachePart}`;
    const cached_data = yield redis_1.redis.get(redis_key);
    if (cached_data && typeof cached_data === "string") {
        res.status(200).json(JSON.parse(cached_data));
        return;
    }
    const db = yield (0, db_1.connectDB)();
    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);
    let announcements = [];
    let totalCount = 0;
    const filter = {
        date: { $gte: start, $lte: end },
        language: targetLanguage,
        state: sortedStates.length ? { $in: sortedStates } : { $exists: true },
    };
    const collationOptions = { collation: { locale: 'simple', strength: 1 } };
    if (Category.length > 0) {
        filter.category = Category ? Category : { $exists: true };
    }
    announcements = yield db.collection("Translated_Announcements")
        .find(filter, Object.assign({ projection: {
            sections: 0,
            language: 0,
            source_link: 0,
            _id: 0
        } }, collationOptions))
        .sort({ date: -1, _id: -1 })
        .skip(skip)
        .limit(pageSize)
        .toArray();
    totalCount = yield db.collection("Translated_Announcements")
        .countDocuments(filter, collationOptions);
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
exports.SerachallIndiaAnnouncements = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { target_lan, startDate, endDate, page, limit, SearchInput, states } = req.query;
    const announcementsStartDate = startDate
        ? new Date(startDate)
        : new Date(new Date().setDate(new Date().getDate() - 7));
    const announcementsEndDate = endDate
        ? new Date(endDate)
        : new Date();
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const selectedStates = (0, translatePayloadAnnoucements_1.PrasePayloadArray)(states);
    const sortedStates = [...selectedStates].sort();
    const stateCachePart = sortedStates.join(",");
    let searchInputValue = typeof SearchInput === "string" && SearchInput.length > 0 ? SearchInput : "";
    if (isNaN(announcementsStartDate.getTime()) || isNaN(announcementsEndDate.getTime())) {
        res.status(400).json({ error: "Invalid date format" });
        return;
    }
    const targetLanguage = lan_1.LANGUAGE_CODES[target_lan] || "en";
    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);
    const redis_key = `AllGroupsIndiaAnnouncements_${targetLanguage}_${announcementsStartDate.toISOString().split('T')[0]}_${announcementsEndDate.toISOString().split('T')[0]}_page${page}_limit${limit}_search${searchInputValue}-${stateCachePart}`;
    const cached_data = yield redis_1.redis.get(redis_key);
    if (cached_data) {
        const parsedData = typeof cached_data === 'string'
            ? JSON.parse(cached_data)
            : cached_data;
        res.status(200).json(parsedData);
        return;
    }
    const db = yield (0, db_1.connectDB)();
    let indiaAnnouncements = [];
    let totalCount = 0;
    const stateFilter = selectedStates.length > 0 ? { state: { $in: selectedStates } } : {};
    if (searchInputValue.length > 0) {
        const searchRegex = new RegExp(searchInputValue, "i");
        const pipeline = [
            {
                $match: Object.assign(Object.assign({ date: { $gte: start, $lte: end }, language: targetLanguage }, stateFilter), { $or: [
                        { title: searchRegex },
                        { state: searchRegex },
                        { category: searchRegex },
                        { description: searchRegex },
                        { department: searchRegex }
                    ] })
            },
            {
                $addFields: {
                    searchScore: {
                        $switch: {
                            branches: [
                                { case: { $regexMatch: { input: "$title", regex: searchRegex } }, then: 100 },
                                { case: { $regexMatch: { input: "$state", regex: searchRegex } }, then: 50 },
                                { case: { $regexMatch: { input: "$category", regex: searchRegex } }, then: 30 },
                                { case: { $regexMatch: { input: "$description", regex: searchRegex } }, then: 20 }
                            ],
                            default: 10
                        }
                    }
                }
            },
            { $sort: { searchScore: -1, date: -1, _id: -1 } },
            { $skip: skip },
            { $limit: pageSize },
            {
                $project: {
                    searchScore: 0,
                    sections: 0,
                    language: 0,
                    source_link: 0
                }
            }
        ];
        indiaAnnouncements = yield db.collection("Translated_Announcements").aggregate(pipeline).toArray();
        // Count total matching documents for pagination
        const countFilter = Object.assign(Object.assign({ date: { $gte: start, $lte: end }, language: targetLanguage }, stateFilter), { $or: [
                { title: searchRegex },
                { state: searchRegex },
                { category: searchRegex },
                { description: searchRegex },
                { department: searchRegex }
            ] });
        totalCount = yield db.collection("Translated_Announcements").countDocuments(countFilter);
    }
    else {
        // NO SEARCH - Just date/language filter
        const filter = Object.assign({ date: { $gte: start, $lte: end }, language: targetLanguage }, stateFilter);
        indiaAnnouncements = yield db
            .collection("Translated_Announcements")
            .find(filter, {
            projection: { sections: 0, language: 0, source_link: 0 }
        })
            .sort({ date: -1, _id: -1 })
            .skip(skip)
            .limit(pageSize)
            .toArray();
        totalCount = yield db.collection("Translated_Announcements").countDocuments(filter);
    }
    const totalPages = Math.ceil(totalCount / pageSize);
    const responseData = {
        success: true,
        data: indiaAnnouncements,
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
exports.GetIndiaAnnouncement = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, target_lan } = req.query;
    if (!id || typeof id !== "string" || !target_lan || typeof target_lan !== "string") {
        res.status(400).json({ message: "Missing or invalid id or target_lan is bad" });
        return;
    }
    const targetLanguage = lan_1.LANGUAGE_CODES[target_lan] || "English";
    const redis_key = `Announcement_${targetLanguage}_${id}_${target_lan}`;
    const cached_data = yield redis_1.redis.get(redis_key);
    if (cached_data) {
        const parsedData = typeof cached_data === "string" ? JSON.parse(cached_data) : cached_data;
        res.status(200).json(parsedData);
        return;
    }
    let objectId;
    try {
        objectId = new mongodb_1.ObjectId(id);
    }
    catch (_a) {
        res.status(400).json({ message: "Invalid ObjectId format" });
        return;
    }
    const db = yield (0, db_1.connectDB)();
    const announcement = yield db
        .collection("Translated_Announcements")
        .find({
        announcementId: objectId,
        language: targetLanguage
    }, {
        projection: {
            description: 0,
            language: 0,
            _id: 0
        }
    }).toArray();
    if (!announcement) {
        res.status(404).json({ error: "Announcement not found" });
        return;
    }
    const responseData = {
        success: true,
        data: announcement[0],
        languageCode: lan_1.LANGUAGE_CODES[targetLanguage] || "en"
    };
    yield redis_1.redis.set(redis_key, JSON.stringify(responseData), { ex: 300 });
    res.status(200).json(responseData);
    return;
}));
exports.GetallAnnoucementsDepartments = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { target_lan, startDate, endDate, states } = req.query;
    if (!target_lan || typeof target_lan !== "string") {
        res.status(400).json({ message: "Missing or invalid target_lan" });
        return;
    }
    const targetLanguage = lan_1.LANGUAGE_CODES[target_lan] || "en";
    const selectedStates = (0, translatePayloadAnnoucements_1.PrasePayloadArray)(states);
    const sortedStates = [...selectedStates].sort();
    const stateCachePart = sortedStates.join(",");
    const announcementsStartDate = startDate
        ? new Date(startDate)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const announcementsEndDate = endDate
        ? new Date(endDate)
        : new Date();
    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);
    const redisKey = `All_Announcements_Departments_${targetLanguage}_${start
        .toISOString()
        .split("T")[0]}_${end
        .toISOString()
        .split("T")[0]}_${stateCachePart}`;
    const cached = yield redis_1.redis.get(redisKey);
    if (cached) {
        res.status(200).json(cached);
        return;
    }
    const db = yield (0, db_1.connectDB)();
    const filter = {
        date: { $gte: start, $lte: end },
        language: targetLanguage,
        state: sortedStates.length ? { $in: sortedStates } : { $exists: true },
    };
    const collationOptions = { collation: { locale: "simple", strength: 1 } };
    const departments = yield db
        .collection("Translated_Announcements")
        .distinct("department", filter, collationOptions);
    const response = {
        success: true,
        data: departments,
    };
    yield redis_1.redis.set(redisKey, JSON.stringify(response), { ex: 300 });
    res.status(200).json(response);
    return;
}));
exports.GetAllTrendingTitles = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { target_lan } = req.query;
    if (!target_lan || typeof target_lan !== "string") {
        res.status(400).json({ message: "Missing or invalid target_lan" });
        return;
    }
    const targetLanguage = lan_1.LANGUAGE_CODES[target_lan] || "en";
    const redis_key = `Trending_Announcements_${targetLanguage}`;
    const cached_data = yield redis_1.redis.get(redis_key);
    if (cached_data) {
        const parsedData = typeof cached_data === "string" ? JSON.parse(cached_data) : cached_data;
        res.status(200).json(parsedData);
        return;
    }
    const db = yield (0, db_1.connectDB)();
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    const trendingAnnouncements = yield db
        .collection("Translated_Announcements")
        .aggregate([
        {
            $match: {
                date: { $gte: fifteenDaysAgo },
                language: targetLanguage,
            },
        },
        {
            $sort: { date: -1 },
        },
        {
            $group: {
                _id: "$department",
                doc: { $first: "$$ROOT" },
            },
        },
        {
            $replaceRoot: { newRoot: "$doc" },
        },
        {
            $sort: { date: -1 },
        },
        {
            $project: {
                announcementId: 1,
                title: 1,
            }
        }
    ])
        .toArray();
    const responseData = {
        success: true,
        data: trendingAnnouncements,
        languageCode: lan_1.LANGUAGE_CODES[targetLanguage] || "en",
    };
    yield redis_1.redis.set(redis_key, JSON.stringify(responseData), { ex: 300 });
    res.status(200).json(responseData);
    return;
}));
exports.GetAllCountAnnouncements = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { target_lan, startDate, endDate } = req.query;
    if (!target_lan || typeof target_lan !== "string") {
        res.status(400).json({ message: "Missing or invalid target_lan" });
        return;
    }
    const targetLanguage = lan_1.LANGUAGE_CODES[target_lan] || "en";
    const announcementsStartDate = startDate
        ? new Date(startDate)
        : new Date(new Date().setDate(new Date().getDate() - 7));
    const announcementsEndDate = endDate
        ? new Date(endDate)
        : new Date();
    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);
    const redis_key = `Count_Announcements_${targetLanguage}_${start
        .toISOString()
        .split("T")[0]}_${end.toISOString().split("T")[0]}`;
    const cached_data = yield redis_1.redis.get(redis_key);
    if (cached_data) {
        const parsedData = typeof cached_data === "string" ? JSON.parse(cached_data) : cached_data;
        res.status(200).json(parsedData);
        return;
    }
    const db = yield (0, db_1.connectDB)();
    const stateCounts = yield db
        .collection("Translated_Announcements")
        .aggregate([
        {
            $match: {
                date: { $gte: start, $lte: end },
                language: targetLanguage
            }
        },
        {
            $group: {
                _id: "$state",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                state: "$_id",
                count: 1
            }
        },
        {
            $sort: { count: -1 }
        }
    ])
        .toArray();
    yield redis_1.redis.set(redis_key, JSON.stringify({
        success: true,
        data: stateCounts
    }), { ex: 300 });
    res.status(200).json({
        success: true,
        data: stateCounts
    });
    return;
}));
exports.GetAllCategoriesAnnouncements = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { target_lan, startDate, endDate } = req.query;
    if (!target_lan || typeof target_lan !== "string") {
        res.status(400).json({ message: "Missing or invalid target_lan" });
        return;
    }
    const targetLanguage = lan_1.LANGUAGE_CODES[target_lan] || "en";
    const announcementsStartDate = startDate
        ? new Date(startDate)
        : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const announcementsEndDate = endDate
        ? new Date(endDate)
        : new Date();
    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);
    const redisKey = `All_Announcements_Categories_${targetLanguage}_${start
        .toISOString()
        .split("T")[0]}_${end
        .toISOString()
        .split("T")[0]}`;
    const cached = yield redis_1.redis.get(redisKey);
    if (cached) {
        res.status(200).json(cached);
        return;
    }
    const db = yield (0, db_1.connectDB)();
    const filter = {
        date: { $gte: start, $lte: end },
        language: targetLanguage,
    };
    const collationOptions = { collation: { locale: "simple", strength: 1 } };
    const categories = yield db
        .collection("Translated_Announcements")
        .distinct("category", filter, collationOptions);
    const response = {
        success: true,
        data: categories,
    };
    yield redis_1.redis.set(redisKey, JSON.stringify(response), { ex: 300 });
    res.status(200).json(response);
    return;
}));
exports.GetStats = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, db_1.connectDB)();
    const redis_key = `Stats_Announcements_en`;
    const cached_data = yield redis_1.redis.get(redis_key);
    if (cached_data) {
        const parsedData = typeof cached_data === "string" ? JSON.parse(cached_data) : cached_data;
        res.status(200).json(parsedData);
        return;
    }
    const totalAnnouncements = yield db.collection("Translated_Announcements").countDocuments({
        language: "en"
    });
    const totalDepartments = yield db.collection("Translated_Announcements").distinct("department", {
        language: "en"
    });
    yield redis_1.redis.set(redis_key, JSON.stringify({
        success: true,
        data: {
            totalAnnouncements,
            totalDepartments: totalDepartments.length,
        }
    }), { ex: 300 });
    res.status(200).json({
        success: true,
        data: {
            totalAnnouncements,
            totalDepartments: totalDepartments.length,
        }
    });
}));
