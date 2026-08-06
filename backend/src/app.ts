import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import { errorHandler } from './middlewares/errorHandler';
import rateLimit from 'express-rate-limit';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();

const otpLimiter = rateLimit({
  windowMs: (Number(process.env.OTP_RATE_LIMIT_WINDOW) || 10) * 60 * 1000,
  max: Number(process.env.OTP_RATE_LIMIT_MAX) || 5,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const rawOrigins = process.env.CORS_ORIGIN || '';
const allowedOrigins = rawOrigins
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = allowedOrigins.length
  ? {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('CORS policy: Origin not allowed'));
      },
    }
  : { origin: true };

app.use(cors(corsOptions));
app.use(express.json());

app.use('/', healthRoutes);
app.use('/api/auth/request-otp', otpLimiter);
app.use('/api/auth/resend-otp', otpLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.use(errorHandler);

export default app;