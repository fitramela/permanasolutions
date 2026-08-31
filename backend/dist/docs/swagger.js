"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend API',
            version: '1.0.0',
            description: 'REST API Documentation',
        },
        servers: [
            {
                url: process.env.APP_URL || 'http://localhost:4000',
                description: 'Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // ✅ Gunakan pattern yang lebih spesifik
    apis: [
        './src/routes/*.js',
        './src/routes/*.ts',
        './src/routes/**/*.js',
        './src/routes/**/*.ts',
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
