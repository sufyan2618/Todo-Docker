import Redis from 'ioredis';
import { ENV } from '../util/dotenv.js';

const redisConnection = new Redis(ENV.REDIS_URL, {
    maxRetriesPerRequest: 100,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    enableReadyCheck: true,
    lazyConnect: true,
    enableOfflineQueue: true  // Allows commands to queue when offline
});

redisConnection.on('error', (err) => {
    console.log('Redis Client Error', err.message);
    // Don't throw - just log
});

redisConnection.on('connect', () => {
    console.log('Redis connected successfully');
});

export { redisConnection };