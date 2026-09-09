"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const client_1 = require("@prisma/client");
// Load .env dari root proyek (dua folder di atas backend/src)
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../../.env'),
});
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl)
    throw new Error('DATABASE_URL tidak ditemukan');
const url = new URL(databaseUrl);
const adapter = new adapter_mariadb_1.PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    ssl: true,
    connectionLimit: 5,
});
exports.prisma = new client_1.PrismaClient({ adapter });
