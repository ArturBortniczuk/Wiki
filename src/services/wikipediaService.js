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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.traitPool = void 0;
exports.fetchFighter = fetchFighter;
exports.traitPool = [
    { n: 'SZAŁ', d: 'Atak++ Szybkość+', words: ['wojna', 'bitwa', 'atak', 'armia', 'żołnierz', 'front', 'militarny', 'miecz', 'batalia', 'ofensywa', 'agresja'], m: { atk: 1.5, spd: 1.2 } },
    { n: 'TWIERDZA', d: 'Obrona++ HP+', words: ['zamek', 'fortyfikacja', 'mury', 'beton', 'skała', 'stal', 'żelazo', 'kamień', 'schron', 'bunkier', 'tarcza'], m: { arm: 1.6, hp: 1.3 } },
    { n: 'MAJESTAT', d: 'HP++ Atak+', words: ['król', 'cesarz', 'prezydent', 'tron', 'korona', 'władza', 'pałac', 'imperium', 'rząd', 'dynastia', 'monarcha'], m: { hp: 1.5, atk: 1.2 } },
    { n: 'MISTYCYZM', d: 'Krytyk++ HP+', words: ['bóg', 'religia', 'kościół', 'święty', 'anioł', 'diabeł', 'wiara', 'duch', 'magia', 'rytuał', 'klątwa'], m: { crit: 25, hp: 1.2 } },
    { n: 'INTELEKT', d: 'Atak+ Krytyk+ Szybkość-', words: ['nauka', 'uniwersytet', 'teoria', 'fizyka', 'chemia', 'biologia', 'matematyka', 'badania', 'profesor', 'logika', 'filozofia'], m: { atk: 1.3, crit: 20, spd: 0.8 } },
    { n: 'GIGANT', d: 'HP+++ Szybkość--', words: ['góra', 'ocean', 'planeta', 'kosmos', 'galaktyka', 'gwiazda', 'słońce', 'księżyc', 'wszechświat', 'gigantyczny', 'kontynent'], m: { hp: 1.8, spd: 0.6 } },
    { n: 'ZWINNOŚĆ', d: 'Unik++ Szybkość+', words: ['sport', 'piłka', 'bieg', 'zwinny', 'szybki', 'rower', 'pływanie', 'skok', 'taniec', 'akrobatyka', 'olimpiada'], m: { eva: 25, spd: 1.3 } },
    { n: 'TECHNOLOGIA', d: 'Atak++ Obrona+', words: ['komputer', 'internet', 'telefon', 'maszyna', 'robot', 'elektronika', 'procesor', 'oprogramowanie', 'sieć', 'laser', 'energia'], m: { atk: 1.4, arm: 1.2 } },
    { n: 'DZIKOŚĆ', d: 'Atak+ Unik+', words: ['zwierzę', 'lew', 'tygrys', 'wilk', 'ptak', 'las', 'dżungla', 'natura', 'ssak', 'gad', 'owad', 'drapieżnik'], m: { atk: 1.2, eva: 15 } },
    { n: 'KULTURA', d: 'HP+ Unik+', words: ['film', 'aktor', 'muzyka', 'zespół', 'koncert', 'sztuka', 'obraz', 'malarz', 'książka', 'teatr', 'kino'], m: { hp: 1.2, eva: 10 } },
    { n: 'TRANSPORT', d: 'Szybkość++ Obrona+', words: ['samochód', 'pociąg', 'samolot', 'statek', 'droga', 'most', 'silnik', 'transport', 'podróż', 'kolej', 'lotnisko'], m: { spd: 1.4, arm: 1.2 } },
    { n: 'ZABÓJCA', d: 'Krytyk+++ HP--', words: ['śmierć', 'morderstwo', 'zabójca', 'trucizna', 'krew', 'ofiara', 'egzekucja', 'zamach', 'sztylet', 'cień', 'kat'], m: { crit: 40, hp: 0.6, atk: 1.3 } },
    { n: 'DYPLOMACJA', d: 'Obrona+ HP+ Atak-', words: ['prawo', 'traktat', 'sąd', 'polityka', 'senat', 'ustawa', 'kodeks', 'konstytucja', 'parlament', 'ambasador', 'negocjacje'], m: { arm: 1.3, hp: 1.2, atk: 0.8 } },
    { n: 'FLORA', d: 'HP++ Obrona+', words: ['kwiat', 'drzewo', 'roślina', 'ogród', 'botanika', 'liść', 'puszcza', 'flora', 'park', 'sad', 'ekosystem'], m: { hp: 1.4, arm: 1.2 } },
    { n: 'GEOGRAFIA', d: 'Obrona++ Szybkość-', words: ['mapa', 'kraj', 'państwo', 'region', 'prowincja', 'granica', 'terytorium', 'geografia', 'atlas', 'wyspa', 'półwysep'], m: { arm: 1.4, spd: 0.9 } },
    { n: 'KULINARIA', d: 'HP++ Szybkość-', words: ['kuchnia', 'jedzenie', 'gotowanie', 'potrawa', 'restauracja', 'chleb', 'wino', 'cukier', 'mięso', 'warzywo', 'smak'], m: { hp: 1.4, spd: 0.9 } },
    { n: 'MEDYCYNA', d: 'HP+++ Atak-', words: ['lekarz', 'szpital', 'medycyna', 'pacjent', 'choroba', 'leczenie', 'lek', 'anatomia', 'zdrowie', 'operacja', 'klinika'], m: { hp: 1.6, atk: 0.7 } },
    { n: 'HANDEL', d: 'Obrona+ Szybkość+', words: ['pieniądze', 'bank', 'handel', 'giełda', 'waluta', 'biznes', 'firma', 'rynek', 'eksport', 'podatek', 'finanse'], m: { arm: 1.2, spd: 1.2 } },
    { n: 'MUZEUM', d: 'HP++ Krytyk-', words: ['historia', 'zabytek', 'archeologia', 'wykopaliska', 'muzeum', 'antyku', 'przeszłość', 'kronika', 'dziedzictwo', 'eksponat', 'era'], m: { hp: 1.4, crit: -10 } },
    { n: 'DOMATOR', d: 'Obrona+ HP+', words: ['dom', 'budynek', 'mieszkanie', 'rodzina', 'dziecko', 'ulica', 'dzielnica', 'architektura', 'osiedle', 'wnętrze', 'komfort'], m: { arm: 1.2, hp: 1.2 } }
];
var redis_1 = require("../lib/redis");
function fetchFighter() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, redis_1.redis.srandmember('wiki:fighters')];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        throw new Error('No fighters available in the database. Please run the seeder script first.');
                    }
                    return [2 /*return*/, JSON.parse(result)];
            }
        });
    });
}
