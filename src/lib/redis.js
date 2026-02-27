"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
var ioredis_1 = __importDefault(require("ioredis"));
if (!process.env.wiki_REDIS_URL) {
    throw new Error('Missing wiki_REDIS_URL in .env.local');
}
// Create a singleton instance to prevent connection leaks during hot reloads in dev
var globalForRedis = global;
exports.redis = globalForRedis.redis || new ioredis_1.default(process.env.wiki_REDIS_URL);
if (process.env.NODE_ENV !== 'production')
    globalForRedis.redis = exports.redis;
