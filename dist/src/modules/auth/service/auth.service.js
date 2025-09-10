"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
require("dotenv/config");
const seed_1 = require("../../../database/prisma/seed");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    async register(data) {
        const existing = await seed_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            throw new Error('Email déjà utilisé');
        const hashed = await bcryptjs_1.default.hash(data.password, 10);
        const user = await seed_1.prisma.user.create({
            data: {
                email: data.email,
                password: hashed,
                firstname: data.firstname,
                lastname: data.lastname,
                role: data.role || 'pme',
            },
        });
        return { message: 'Utilisateur créé', userId: user.id };
    }
    async login(data) {
        const user = await seed_1.prisma.user.findUnique({ where: { email: data.email } });
        if (!user)
            throw new Error('Email ou mot de passe invalide');
        const valid = await bcryptjs_1.default.compare(data.password, user.password);
        if (!valid)
            throw new Error('Email ou mot de passe invalide');
        const token = jsonwebtoken_1.default.sign({ sub: user.id, role: user.role }, "fdcc0eef-9dfd-45c9-9370-d0ca615b05fb", { expiresIn: '7d' });
        return { access_token: token, user: { id: user.id, email: user.email, role: user.role } };
    }
    async getAccount(token) {
        const decoded = jsonwebtoken_1.default.verify(token, "fdcc0eef-9dfd-45c9-9370-d0ca615b05fb");
        console.log(decoded);
        if (decoded) {
            const user = await seed_1.prisma.user.findUnique({ where: { id: decoded.sub.toString() } });
            if (!user)
                throw new Error('Utilisateur introuvable');
            console.log(user);
            return user;
        }
    }
    async getUser(id) {
        const user = await seed_1.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new Error('Utilisateur introuvable');
        return user;
    }
    async updateUser(id, data) {
        const user = await seed_1.prisma.user.update({ where: { id }, data });
        return user;
    }
    async forgotPassword(email) {
        const user = await seed_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error('Utilisateur introuvable');
        // À remplacer par un envoi réel via nodemailer + token de reset
        return { message: `Lien de réinitialisation simulé pour ${email}` };
    }
}
exports.AuthService = AuthService;
