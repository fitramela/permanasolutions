"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
exports.isOtpExpired = isOtpExpired;
function generateOtp(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}
function isOtpExpired(createdAt, expiryMinutes = 5) {
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    return diffMinutes > expiryMinutes;
}
