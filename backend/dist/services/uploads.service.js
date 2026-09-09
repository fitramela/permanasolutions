"use strict";
/**
 * services/uploads.service.ts
 *
 * Logika upload image.
 * - STORAGE_PROVIDER = 'vercel' / 'cloudinary' → upload ke Cloudinary
 * - STORAGE_PROVIDER = 'local' → simpan ke folder storage lokal
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsService = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const errorHandler_js_1 = require("../middlewares/errorHandler.js");
exports.uploadsService = {
    async uploadImage(file) {
        if (!file)
            throw new errorHandler_js_1.AppError('File tidak ditemukan', 400);
        const isCloud = process.env.STORAGE_PROVIDER === 'cloudinary' || process.env.STORAGE_PROVIDER === 'vercel';
        if (isCloud) {
            return uploadToCloudinary(file);
        }
        else {
            return buildLocalUrl(file);
        }
    },
};
async function uploadToCloudinary(file) {
    if (!file.buffer) {
        throw new errorHandler_js_1.AppError('File buffer tidak tersedia untuk upload cloud', 500);
    }
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder: 'permana',
            // Cloudinary otomatis compress & convert ke webp jika diinginkan
            // transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        }, (error, result) => {
            if (error)
                reject(new errorHandler_js_1.AppError(`Upload gagal: ${error.message}`, 500));
            else
                resolve(result);
        });
        stream.end(file.buffer);
    });
    return {
        url: result.secure_url,
        filename: result.public_id,
        size: file.size,
    };
}
function buildLocalUrl(file) {
    if (!file.filename) {
        throw new errorHandler_js_1.AppError('Filename tidak tersedia untuk local storage', 500);
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
