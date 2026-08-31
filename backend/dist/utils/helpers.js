"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUuid = exports.normalizeString = exports.normalizeEmail = exports.sanitizeUser = void 0;
const sanitizeUser = (user) => {
    const { password, two_fa_secret, ...rest } = user;
    return rest;
};
exports.sanitizeUser = sanitizeUser;
const normalizeEmail = (value) => {
    if (typeof value !== 'string') {
        throw new Error('Email is required');
    }
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
        throw new Error('Email is required');
    }
    return normalized;
};
exports.normalizeEmail = normalizeEmail;
const normalizeString = (value, field) => {
    if (typeof value !== 'string') {
        throw new Error(`${field} is required`);
    }
    const normalized = value.trim();
    if (!normalized) {
        throw new Error(`${field} is required`);
    }
    return normalized;
};
exports.normalizeString = normalizeString;
const normalizeUuid = (value) => {
    if (typeof value !== 'string') {
        throw new Error('Valid UUID is required');
    }
    const trimmed = value.trim();
    if (!trimmed) {
        throw new Error('Valid UUID is required');
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trimmed)) {
        throw new Error('Invalid UUID format');
    }
    return trimmed;
};
exports.normalizeUuid = normalizeUuid;
