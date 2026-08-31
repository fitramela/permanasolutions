import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticate } from '../middlewares/auth.js';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();
router.use(authenticate);


const storageType = process.env.STORAGE_PROVIDER || 'local'; 
const uploadDir = process.env.UPLOAD_DIR || 'storage/images'; 
const maxSize = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;

const isCloud = storageType === 'cloudinary' || storageType === 'vercel';

if (isCloud) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

if (!isCloud) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = isCloud
  ? multer.memoryStorage() 
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDir),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${randomUUID()}${ext}`);
      },
    });

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung') as any, false);
    }
  },
});

router.post(
  '/image',
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file' });
    }

    let fileUrl: string;

    if (isCloud) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'permana' },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });
      fileUrl = result.secure_url;
    } else {
      const baseUrl = process.env.APP_URL || 'http://localhost:4000';
      fileUrl = `${baseUrl}/${uploadDir}/${req.file.filename}`;
    }

    res.status(201).json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename || '',
        size: req.file.size,
      },
    });
  })
);

export default router;