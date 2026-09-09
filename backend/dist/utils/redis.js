"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
exports.redis = new ioredis_1.Redis(REDIS_URL);
exports.redis.on('connect', () => console.log('Redis connected'));
exports.redis.on('error', (err) => console.error('Redis error:', err));
