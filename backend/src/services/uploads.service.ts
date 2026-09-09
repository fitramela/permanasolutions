/**
 * services/uploads.service.ts
 *
 * Logika upload image.
 * - STORAGE_PROVIDER = 'vercel' / 'cloudinary' → upload ke Cloudinary
 * - STORAGE_PROVIDER = 'local' → simpan ke folder storage lokal
 */

import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
import { AppError } from '../middlewares/errorHandler.js';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export const uploadsService = {
  async uploadImage(file: Express.Multer.File): Promise<UploadResult> {
    if (!file) throw new AppError('File tidak ditemukan', 400);

    const isCloud = process.env.STORAGE_PROVIDER === 'cloudinary' || process.env.STORAGE_PROVIDER === 'vercel';
    if (isCloud) {
      return uploadToCloudinary(file);
    } else {
      return buildLocalUrl(file);
    }
  },
};

async function uploadToCloudinary(file: Express.Multer.File): Promise<UploadResult> {
  if (!file.buffer) {
    throw new AppError('File buffer tidak tersedia untuk upload cloud', 500);
  }

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'permana',
        // Cloudinary otomatis compress & convert ke webp jika diinginkan
        // transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error: any, result: any) => {
        if (error) reject(new AppError(`Upload gagal: ${error.message}`, 500));
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });

  return {
    url: result.secure_url,
    filename: result.public_id,
    size: file.size,
  };
}

function buildLocalUrl(file: Express.Multer.File): UploadResult {
  if (!file.filename) {
    throw new AppError('Filename tidak tersedia untuk local storage', 500);
  }

  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const uploadDir = process.env.UPLOAD_DIR || 'storage/images';
  const url = `${baseUrl}/${uploadDir}/${file.filename}`;

  return {
    url,
    filename: file.filename,
    size: file.size,
  };
}
