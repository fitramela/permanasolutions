"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../../.env'),
});
const app_js_1 = __importDefault(require("./app.js"));
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '0.0.0.0';
app_js_1.default.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
