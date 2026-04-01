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
// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SKIP = 690;
const LIMIT = 790;
const SLEEP_MS = 1500;
const MIN_SCORE = 1; // reject if no keyword matched at all
// ─── DOMAIN LISTS ─────────────────────────────────────────────────────────────
// These domains host article feature banners / SEO thumbnails — not real photos
const BLOCKED_DOMAINS = [
    "careers360", "shiksha.com", "collegedunia", "getmyuni",
    "jagranjosh", "jagran.com", "bhaskar.com", "patrika.com",
    "zeenews", "abplive", "newsbytesapp", "entrancezone",
    "successcds", "thenewsminute", "indiatvnews", "amarujala",
    "livehindustan", "navbharattimes", "firstpost.com",
    "theprint.in", "thequint.com", "cache.careers360",
];
// These domains tend to host actual press / event photographs
const PREFERRED_DOMAINS = [
    "pib.gov.in", "pib.nic.in",
    "india.gov.in",
    ".nic.in", ".gov.in",
    "thehindu.com",
    "businessstandard.com",
    "economictimes.indiatimes.com",
    "timesofindia.indiatimes.com",
    "aninews.in", "ani.in",
    "ptinews.com", "pti.in",
    "narendramodi.in", "pmindia.gov.in",
    "vikaspedia.in",
];
// ─── HELPERS ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function buildQuery(ann) {
    const state = ann.state === "IndianGovt" ? "India" : ann.state;
    return [ann.title, state, ann.category, "official ceremony photo"]
        .filter(Boolean)
        .join(" ");
}
function extractKeywords(query) {
    const STOP_WORDS = new Set([
        "the", "and", "for", "with", "from", "that", "this",
        "are", "was", "has", "have", "will", "its", "into",
        "official", "ceremony", "photo", "government", "scheme",
    ]);
    return query
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}
function domainOf(url) {
    try {
        return new URL(url).hostname.toLowerCase();
    }
    catch (_a) {
        return "";
    }
}
function isBlocked(url) {
    const host = domainOf(url);
    return BLOCKED_DOMAINS.some((b) => host.includes(b));
}
function domainBonus(url) {
    const host = domainOf(url);
    return PREFERRED_DOMAINS.some((p) => host.includes(p)) ? 3 : 0;
}
function scoreResult(result, keywords) {
    var _a, _b, _c, _d, _e, _f;
    // Hard reject blocked domains
    if (isBlocked(result.image) || isBlocked((_a = result.url) !== null && _a !== void 0 ? _a : ""))
        return -999;
    const haystack = [(_b = result.title) !== null && _b !== void 0 ? _b : "", (_c = result.url) !== null && _c !== void 0 ? _c : "", (_d = result.image) !== null && _d !== void 0 ? _d : ""]
        .join(" ")
        .toLowerCase();
    const keywordScore = keywords.reduce((acc, kw) => (haystack.includes(kw) ? acc + 1 : acc), 0);
    // Bonus: preferred official/wire domains
    const bonus = domainBonus(result.image) + domainBonus((_e = result.url) !== null && _e !== void 0 ? _e : "");
    // Bonus: larger images are more likely real press photos
    const sizeBonus = ((_f = result.width) !== null && _f !== void 0 ? _f : 0) >= 800 ? 1 : 0;
    return keywordScore + bonus + sizeBonus;
}
// ─── DDG IMAGE FETCH ──────────────────────────────────────────────────────────
function fetchBestImage(query) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        // Step 1 — obtain vqd token
        const tokenRes = yield fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });
        const html = yield tokenRes.text();
        const token = (_a = html.match(/vqd=([\d-]+)/)) === null || _a === void 0 ? void 0 : _a[1];
        if (!token)
            throw new Error("Could not extract DDG vqd token");
        // Step 2 — fetch image results
        const imgRes = yield fetch(`https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${token}&f=,,,,,&p=1&s=0`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://duckduckgo.com/",
                "Accept": "application/json",
            },
        });
        if (!imgRes.ok)
            throw new Error(`DDG responded with HTTP ${imgRes.status}`);
        const data = yield imgRes.json();
        const results = ((_b = data.results) !== null && _b !== void 0 ? _b : []).filter((r) => r.image);
        if (results.length === 0)
            return null;
        // Step 3 — score and rank
        const keywords = extractKeywords(query);
        const scored = results
            .map((r) => (Object.assign(Object.assign({}, r), { _score: scoreResult(r, keywords) })))
            .sort((a, b) => b._score - a._score);
        const best = scored[0];
        console.log(`   🏆 Best [score ${best._score}] ${domainOf(best.image)} — "${(_c = best.title) !== null && _c !== void 0 ? _c : "untitled"}"`);
        // Show top 3 candidates so you can audit
        scored.slice(0, 3).forEach((r, i) => {
            var _a;
            console.log(`      ${i + 1}. [${r._score}] ${domainOf(r.image)} — "${(_a = r.title) !== null && _a !== void 0 ? _a : ""}"`);
        });
        if (best._score < MIN_SCORE) {
            console.log("   ⚠️  Score too low — no relevant image found.");
            return null;
        }
        return best.image;
    });
}
// ─── MAIN ────────────────────────────────────────────────────────────────────
function migrate() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = (yield (0, db_1.connectDB)()).collection("Translated_Announcements");
        const announcements = (yield db
            .find({ language: "en", image: { $exists: false } })
            .toArray());
        console.log(`Found ${announcements.length} announcement(s) without an image.`);
        if (announcements.length === 0) {
            console.log("✅ All done — nothing left to process.");
            return;
        }
        const results = { success: 0, failed: 0, skipped: 0 };
        for (const ann of announcements) {
            const query = buildQuery(ann);
            console.log(`\n📰 "${ann.title}"`);
            console.log(`   Query: "${query}"`);
            try {
                const image = yield fetchBestImage(query);
                if (!image) {
                    results.skipped++;
                    continue;
                }
                console.log(`   🖼️  ${image}`);
                yield db.updateOne({ _id: ann._id }, { $set: { image, image_fetched_at: new Date() } });
                console.log("   ✅ Saved.");
                results.success++;
            }
            catch (err) {
                console.error(`   ❌ Error: ${err.message}`);
                results.failed++;
            }
            yield sleep(SLEEP_MS);
        }
        console.log("\n─────────────────────────────────────────────────");
        console.log(`✅ ${results.success} saved   ⚠️  ${results.skipped} skipped   ❌ ${results.failed} failed`);
    });
}
migrate().catch(console.error);
