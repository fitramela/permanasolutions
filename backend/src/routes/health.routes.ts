import { Router } from 'express';
import { prisma } from '../prisma'; 

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Backend Express is running! Go to /health' });
});

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend Express berjalan!' });
});

router.get('/db-check', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1 as connected`;
    res.json({
      success: true,
      message: 'Database terhubung',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal koneksi ke database',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;