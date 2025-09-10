"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
// auth.guard.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authGuard(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Token manquant' });
    try {
        const payload = jsonwebtoken_1.default.verify(token, "fdcc0eef-9dfd-45c9-9370-d0ca615b05fb");
        req.user = payload;
        next();
    }
    catch (er) {
        console.log("error =>", er);
        res.status(401).json({ error: 'Token invalide' });
    }
}
