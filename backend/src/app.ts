import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import cmsRoutes from './routes/cms.routes.js';
import uploadRoutes from './routes/uploads.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerSpec } from './docs/swagger.js';
import { redis } from './utils/redis.js';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();
app.set('trust proxy', 1);

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const enableSwagger = isDevelopment || isTest;

const otpLimiter = rateLimit({
  windowMs: (Number(process.env.OTP_RATE_LIMIT_WINDOW) || 10) * 60 * 1000,
  max: Number(process.env.OTP_RATE_LIMIT_MAX) || 5,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: redis.call.bind(redis) as any,
  }),
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: redis.call.bind(redis) as any,
  }),
});

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = allowedOrigins.length
  ? {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('CORS policy: Origin not allowed'));
      },
      credentials: true,
    }
  : { origin: true, credentials: true };

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(hpp());

if (process.env.STORAGE_PROVIDER === 'local') {
  const uploadDir = process.env.UPLOAD_DIR || 'storage/images';
  app.use(`/${uploadDir}`, express.static(path.join(__dirname, '../', uploadDir)));
}

if (!isTest) {
  app.use('/api/backend', globalLimiter);
  app.use('/api/backend/auth/request-otp', otpLimiter);
  app.use('/api/backend/auth/resend-otp', otpLimiter);
}

if (enableSwagger) {
  app.use(
    '/api/backend/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
  console.log(`📚 Swagger UI available at /api/backend/docs (${process.env.NODE_ENV} mode)`);
}

app.use('/api/backend', healthRoutes);
app.use('/api/backend/auth', authRoutes);
app.use('/api/backend/users', usersRoutes);
app.use('/api/backend/leads', leadsRoutes);
app.use('/api/backend/cms', cmsRoutes);
app.use('/api/backend/upload', uploadRoutes);
app.use('/api/backend/dashboard', dashboardRoutes);
app.use('/api/backend/track', analyticsRoutes);

app.use(errorHandler);

export default app;