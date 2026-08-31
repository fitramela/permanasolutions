"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOtpAuthUrl = exports.verifyTotpToken = exports.generateQrCodeDataUrl = exports.generateTotpSecret = void 0;
// @ts-ignore
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const generateTotpSecret = (email, issuer = "Permana") => {
    const secret = speakeasy_1.default.generateSecret({
        name: `${issuer} (${email})`,
        length: 20,
    });
    return {
        base32: secret.base32,
        otpauthUrl: secret.otpauth_url,
    };
};
exports.generateTotpSecret = generateTotpSecret;
const generateQrCodeDataUrl = async (otpauthUrl) => {
    return qrcode_1.default.toDataURL(otpauthUrl);
};
exports.generateQrCodeDataUrl = generateQrCodeDataUrl;
const verifyTotpToken = (secret, token, window = 2) => {
    const result = speakeasy_1.default.totp.verify({
        secret,
        encoding: "base32",
        token,
        window,
    });
    if (result === true) {
        return true;
    }
    if (typeof result === "object" &&
        result !== null) {
        return true;
    }
    return false;
};
exports.verifyTotpToken = verifyTotpToken;
const buildOtpAuthUrl = (secret, email, issuer = "Permana") => {
    return speakeasy_1.default.otpauthURL({
        secret,
        label: email,
        issuer,
        encoding: "base32",
    });
};
exports.buildOtpAuthUrl = buildOtpAuthUrl;
