"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
dotenv.config({ path: '.env.local' });
var redis_1 = require("../src/lib/redis");
var wikipediaService_1 = require("../src/services/wikipediaService");
// How many fighters we want in the database
var TARGET_FIGHTERS = 10000;
// How long to wait between Wikipedia API calls (ms)
var API_DELAY_MS = 150;
// Utility to delay execution
var delay = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
function fetchFighterData() {
    return __awaiter(this, void 0, void 0, function () {
        var rnd, rndD, title_1, stat, statD, page, imgReq, imgD, text_1, baseHp, baseAtk, revs, links, langs, extLinksCount, catCount, isProtected, baseArm, baseSpd, baseCrit, baseEva, f_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, fetch('https://pl.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&rnnamespace=0&format=json&origin=*', {
                        headers: {
                            'User-Agent': 'WikiWarsBot/1.0 (Contact: WikiWars@local.dev)'
                        }
                    })];
                case 1:
                    rnd = _a.sent();
                    return [4 /*yield*/, rnd.json()];
                case 2:
                    rndD = _a.sent();
                    title_1 = rndD.query.random[0].title;
                    return [4 /*yield*/, fetch("https://pl.wikipedia.org/w/api.php?action=query&prop=info|images|revisions|links|langlinks|extlinks|categories&inprop=protection&pllimit=max&lllimit=max&ellimit=max&cllimit=max&titles=".concat(encodeURIComponent(title_1), "&format=json&origin=*"), {
                        headers: {
                            'User-Agent': 'WikiWarsBot/1.0 (Contact: WikiWars@local.dev)'
                        }
                    })];
                case 3:
                    stat = _a.sent();
                    return [4 /*yield*/, stat.json()];
                case 4:
                    statD = _a.sent();
                    page = Object.values(statD.query.pages)[0];
                    if (!(page.length && page.length > 5000 && page.images && page.images.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, fetch("https://pl.wikipedia.org/api/rest_v1/page/summary/".concat(encodeURIComponent(title_1)), {
                        headers: {
                            'User-Agent': 'WikiWarsBot/1.0 (Contact: WikiWars@local.dev)'
                        }
                    })];
                case 5:
                    imgReq = _a.sent();
                    return [4 /*yield*/, imgReq.json()];
                case 6:
                    imgD = _a.sent();
                    if (!imgD.thumbnail || !imgD.thumbnail.source) {
                        return [2 /*return*/, null];
                    }
                    text_1 = (imgD.extract || "").toLowerCase();
                    baseHp = page.length / 5;
                    baseAtk = Math.max(40, (page.images ? page.images.length * 15 : 40));
                    revs = page.revisions ? page.revisions.length : 1;
                    links = page.links ? page.links.length : 0;
                    langs = page.langlinks ? page.langlinks.length : 0;
                    extLinksCount = page.extlinks ? page.extlinks.length : 0;
                    catCount = page.categories ? page.categories.length : 0;
                    isProtected = page.protection && page.protection.length > 0;
                    baseArm = 5 + Math.min(40, (extLinksCount * 0.5));
                    baseSpd = 1.0 + (langs * 0.05);
                    baseCrit = Math.min(60, links * 0.2);
                    baseEva = 50 * Math.pow(0.95, catCount);
                    f_1 = {
                        id: Math.random().toString(36).substring(7),
                        title: title_1,
                        img: imgD.thumbnail ? imgD.thumbnail.source : null,
                        hp: baseHp,
                        atk: baseAtk,
                        arm: baseArm,
                        spd: baseSpd,
                        crit: baseCrit,
                        eva: baseEva,
                        traits: [],
                        raw: page.length,
                        imgCount: page.images ? page.images.length : 0,
                        revCount: revs,
                        linkCount: links,
                        langCount: langs,
                        isProtected: isProtected,
                        tooltips: {
                            hp: "D\u0142ugo\u015B\u0107 tekstu (".concat(page.length, " znak\u00F3w) / 5"),
                            atk: "Baza 40 + (Liczba obraz\u00F3w: ".concat(page.images ? page.images.length : 0, " * 15)"),
                            arm: "Baza 5% + 0.5% za ka\u017Cdy link zewn\u0119trzny (".concat(extLinksCount, " - Max 40%)"),
                            spd: "Baza 1.0 + 5% za ka\u017Cdy przet\u0142umaczony j\u0119zyk obiektu (".concat(langs, ")"),
                            crit: "0.2% za ka\u017Cdy link wewn\u0119trzny na stronie wpisu (".concat(links, " - Max 60%)"),
                            eva: "Zwinno\u015B\u0107 bazowa 50%, ka\u017Cda kategoria zmniejsza obecn\u0105 warto\u015B\u0107 o 5% (Kategorii: ".concat(catCount, ")")
                        }
                    };
                    wikipediaService_1.traitPool.forEach(function (t) {
                        var hasWord = t.words.some(function (word) {
                            return text_1.includes(word) || title_1.toLowerCase().includes(word);
                        });
                        if (hasWord) {
                            f_1.traits.push(t);
                            if (t.m.hp)
                                f_1.hp *= t.m.hp;
                            if (t.m.atk)
                                f_1.atk *= t.m.atk;
                            if (t.m.arm)
                                f_1.arm *= t.m.arm;
                            if (t.m.spd)
                                f_1.spd *= t.m.spd;
                            if (t.m.crit)
                                f_1.crit += t.m.crit;
                            if (t.m.eva)
                                f_1.eva += t.m.eva;
                        }
                    });
                    f_1.maxHp = Math.max(1, Math.floor(f_1.hp));
                    f_1.hp = f_1.maxHp;
                    f_1.arm = Math.max(0, Math.min(85, Math.floor(f_1.arm)));
                    f_1.atk = Math.max(1, Math.floor(f_1.atk));
                    f_1.spd = Math.max(0.1, f_1.spd);
                    f_1.crit = Math.round(Math.max(0, Math.min(75, f_1.crit)) * 100) / 100;
                    f_1.eva = Math.max(0, Math.round(Math.min(60, f_1.eva)));
                    return [2 /*return*/, f_1];
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_1 = _a.sent();
                    console.error("Error fetching article:", e_1.message);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, null];
            }
        });
    });
}
function runSeeder() {
    return __awaiter(this, void 0, void 0, function () {
        var key, successCount, attemptCount, fighter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starting Wikipedia Fighter Seeder. Target: ".concat(TARGET_FIGHTERS, " valid articles."));
                    key = 'wiki:fighters';
                // return [4 /*yield*/, redis_1.redis.del(key)];
                case 1:
                    // _a.sent();
                    console.log("Appending new fighters to the '".concat(key, "' set in Redis."));
                    successCount = 0;
                    attemptCount = 0;
                    _a.label = 2;
                case 2:
                    if (!(successCount < TARGET_FIGHTERS)) return [3 /*break*/, 7];
                    attemptCount++;
                    return [4 /*yield*/, fetchFighterData()];
                case 3:
                    fighter = _a.sent();
                    if (!fighter) return [3 /*break*/, 5];
                    // Add the fighter as a serialized JSON string to the Redis set
                    return [4 /*yield*/, redis_1.redis.sadd(key, JSON.stringify(fighter))];
                case 4:
                    // Add the fighter as a serialized JSON string to the Redis set
                    _a.sent();
                    successCount++;
                    // Log progress every 10 successes
                    if (successCount % 10 === 0 || successCount === TARGET_FIGHTERS) {
                        console.log("Progress: ".concat(successCount, " / ").concat(TARGET_FIGHTERS, " valid fighters saved. (Attempts so far: ").concat(attemptCount, ")"));
                    }
                    _a.label = 5;
                case 5:
                    // Wait before the next request to respect rate limits
                    return [4 /*yield*/, delay(API_DELAY_MS)];
                case 6:
                    // Wait before the next request to respect rate limits
                    _a.sent();
                    return [3 /*break*/, 2];
                case 7:
                    console.log("\nSeeding Complete! \uD83C\uDF89");
                    console.log("Successfully stored ".concat(TARGET_FIGHTERS, " fighters in Redis."));
                    console.log("Total Wikipedia articles checked: ".concat(attemptCount));
                    // Disconnect from redis to allow the script process to exit
                    redis_1.redis.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
runSeeder().catch(console.error);
