"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = require("../prisma.js");
const redis_js_1 = require("../utils/redis.js"); // sesuaikan path jika berbeda
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ message: 'Backend Express is running! Go to /health' });
});
router.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend Express berjalan!' });
});
router.get('/db-check', async (req, res) => {
    let dbStatus = { connected: false, message: 'Gagal koneksi ke database' };
    let redisStatus = { connected: false, message: 'Gagal koneksi ke Redis' };
    try {
        await prisma_js_1.prisma.$queryRaw `SELECT 1 as connected`;
        dbStatus = { connected: true, message: 'Database terhubung' };
    }
    catch (error) {
        console.error('Database connection error:', error);
        dbStatus.message = error.message || 'Unknown database error';
    }
    try {
        await redis_js_1.redis.set('ping', 'pong', 'EX', 5);
        const result = await redis_js_1.redis.get('ping');
        if (result === 'pong') {
            redisStatus = { connected: true, message: 'Redis terhubung' };
        }
        else {
            redisStatus.message = 'Redis response invalid';
        }
    }
    catch (error) {
        console.error('Redis connection error:', error);
        redisStatus.message = error.message || 'Unknown Redis error';
    }
    const success = dbStatus.connected && redisStatus.connected;
    res.status(success ? 200 : 500).json({
        success,
        database: dbStatus,
        redis: redisStatus,
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
