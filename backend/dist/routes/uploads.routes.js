"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const fs_1 = __importDefault(require("fs"));
const asyncHandler_js_1 = require("../middlewares/asyncHandler.js");
const auth_js_1 = require("../middlewares/auth.js");
const cloudinary_1 = require("cloudinary");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticate);
const storageType = process.env.STORAGE_PROVIDER || 'local';
const uploadDir = process.env.UPLOAD_DIR || 'storage/images';
const maxSize = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;
const isCloud = storageType === 'cloudinary' || storageType === 'vercel';
if (isCloud) {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}
if (!isCloud) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = isCloud
    ? multer_1.default.memoryStorage()
    : multer_1.default.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
            const ext = path_1.default.extname(file.originalname);
            cb(null, `${(0, crypto_1.randomUUID)()}${ext}`);
        },
    });
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Format file tidak didukung'), false);
        }
    },
});
router.post('/image', upload.single('file'), (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Tidak ada file' });
    }
    let fileUrl;
    if (isCloud) {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'permana' }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            stream.end(req.file.buffer);
        });
        fileUrl = result.secure_url;
    }
    else {
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
}));
exports.default = router;
