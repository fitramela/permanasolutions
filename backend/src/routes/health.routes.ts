import { Router } from 'express';
import { prisma } from '../prisma.js';
import { redis } from '../utils/redis.js'; // sesuaikan path jika berbeda

const router = Router();

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
    await prisma.$queryRaw`SELECT 1 as connected`;
    dbStatus = { connected: true, message: 'Database terhubung' };
  } catch (error: any) {
    console.error('Database connection error:', error);
    dbStatus.message = error.message || 'Unknown database error';
  }

  try {
    await redis.set('ping', 'pong', 'EX', 5);
    const result = await redis.get('ping');
    if (result === 'pong') {
      redisStatus = { connected: true, message: 'Redis terhubung' };
    } else {
      redisStatus.message = 'Redis response invalid';
    }
  } catch (error: any) {
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

export default router;