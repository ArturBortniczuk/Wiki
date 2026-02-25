import Redis from 'ioredis';

if (!process.env.wiki_REDIS_URL) {
    throw new Error('Missing wiki_REDIS_URL in .env.local');
}

// Create a singleton instance to prevent connection leaks during hot reloads in dev
const globalForRedis = global as unknown as { redis: Redis };

export const redis = globalForRedis.redis || new Redis(process.env.wiki_REDIS_URL);

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
