"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const express_rate_limit_1 = require("express-rate-limit");
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const health_routes_js_1 = __importDefault(require("./routes/health.routes.js"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const users_routes_js_1 = __importDefault(require("./routes/users.routes.js"));
const leads_routes_js_1 = __importDefault(require("./routes/leads.routes.js"));
const cms_routes_js_1 = __importDefault(require("./routes/cms.routes.js"));
const uploads_routes_js_1 = __importDefault(require("./routes/uploads.routes.js"));
const dashboard_routes_js_1 = __importDefault(require("./routes/dashboard.routes.js"));
const analytics_routes_js_1 = __importDefault(require("./routes/analytics.routes.js"));
const errorHandler_js_1 = require("./middlewares/errorHandler.js");
const swagger_js_1 = require("./docs/swagger.js");
const redis_js_1 = require("./utils/redis.js");
BigInt.prototype.toJSON = function () {
    return this.toString();
};
const app = (0, express_1.default)();
app.set('trust proxy', 1);
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const enableSwagger = isDevelopment || isTest;
const otpLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: (Number(process.env.OTP_RATE_LIMIT_WINDOW) || 10) * 60 * 1000,
    max: Number(process.env.OTP_RATE_LIMIT_MAX) || 5,
    message: {
        success: false,
        message: 'Too many OTP requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.default({
        sendCommand: redis_js_1.redis.call.bind(redis_js_1.redis),
    }),
});
const globalLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.default({
        sendCommand: redis_js_1.redis.call.bind(redis_js_1.redis),
    }),
});
const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const corsOptions = allowedOrigins.length
    ? {
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin))
                return callback(null, true);
            callback(new Error('CORS policy: Origin not allowed'));
        },
        credentials: true,
    }
    : { origin: true, credentials: true };
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, hpp_1.default)());
if (process.env.STORAGE_PROVIDER === 'local') {
    const uploadDir = process.env.UPLOAD_DIR || 'storage/images';
    app.use(`/${uploadDir}`, express_1.default.static(path_1.default.join(__dirname, '../', uploadDir)));
}
if (!isTest) {
    app.use('/api/backend', globalLimiter);
    app.use('/api/backend/auth/request-otp', otpLimiter);
    app.use('/api/backend/auth/resend-otp', otpLimiter);
}
if (enableSwagger) {
    app.use('/api/backend/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_js_1.swaggerSpec, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    }));
    console.log(`📚 Swagger UI available at /api/backend/docs (${process.env.NODE_ENV} mode)`);
}
app.use('/api/backend', health_routes_js_1.default);
app.use('/api/backend/auth', auth_routes_js_1.default);
app.use('/api/backend/users', users_routes_js_1.default);
app.use('/api/backend/leads', leads_routes_js_1.default);
app.use('/api/backend/cms', cms_routes_js_1.default);
app.use('/api/backend/upload', uploads_routes_js_1.default);
app.use('/api/backend/dashboard', dashboard_routes_js_1.default);
app.use('/api/backend/track', analytics_routes_js_1.default);
app.use(errorHandler_js_1.errorHandler);
exports.default = app;
