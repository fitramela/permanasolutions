import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/prisma/client.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry: A record with this field already exists',
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }
  }

  if (err.message === 'Invalid or expired token') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};