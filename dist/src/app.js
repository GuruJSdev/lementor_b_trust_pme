"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const routes_1 = __importDefault(require("./modules/auth/routes"));
const routes_2 = __importDefault(require("./modules/pme/routes"));
const routes_3 = __importDefault(require("./modules/scoring/routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', routes_1.default);
app.use('/api/pme', routes_2.default);
app.use('/api/scoring', routes_3.default);
exports.default = app;
