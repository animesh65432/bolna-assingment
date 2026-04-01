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
const db_1 = require("./db");
function propagateImagesToAllLanguages() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const client = yield (0, db_1.connectDB)();
        const db = (yield (0, db_1.connectDB)()).collection("Translated_Announcements");
        // Step 1: Find all English docs with images
        const enDocs = yield db.find({
            language: "en",
            image: { $exists: true, $ne: null }
        }).toArray();
        console.log(`Found ${enDocs.length} English docs with images`);
        let totalUpdated = 0;
        // Step 2: For each EN doc, push image to all other languages
        for (const enDoc of enDocs) {
            const result = yield db.updateMany({
                announcementId: enDoc.announcementId,
                language: { $ne: "en" },
                image: { $exists: false }
            }, {
                $set: {
                    image: enDoc.image,
                    image_fetched_at: (_a = enDoc.image_fetched_at) !== null && _a !== void 0 ? _a : new Date()
                }
            });
            totalUpdated += result.modifiedCount;
        }
        console.log(`✅ Done! ${totalUpdated} documents updated across all languages.`);
    });
}
propagateImagesToAllLanguages().catch(console.error);
