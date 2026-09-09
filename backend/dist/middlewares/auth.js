"use strict";
/**
 * middlewares/auth.ts
 *
 * Middleware autentikasi JWT.
 * - Cek header Authorization Bearer
 * - Verifikasi token (termasuk cek blacklist Redis)
 * - Inject req.user untuk digunakan oleh handler
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_js_1 = require("../utils/jwt.js");
/**
 * Middleware: wajib login.
 * Token yang sudah di-blacklist (logout) akan ditolak.
 */
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Unauthorized: Token tidak ditemukan' });
        return;
    }
    const token = authHeader.slice(7).trim();
    if (!token) {
        res.status(401).json({ success: false, message: 'Unauthorized: Token tidak valid' });
        return;
    }
    try {
        const payload = await (0, jwt_js_1.verifyToken)(token);
        req.user = payload;
        req.token = token; // dibutuhkan oleh logout handler
        next();
    }
    catch (err) {
        const message = err.message === 'Token has been revoked'
            ? 'Sesi telah berakhir. Silakan login kembali.'
            : 'Unauthorized: Token tidak valid atau sudah expired';
        res.status(401).json({ success: false, message });
    }
};
exports.authenticate = authenticate;
