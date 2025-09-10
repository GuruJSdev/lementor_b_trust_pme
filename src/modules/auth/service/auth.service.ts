import 'dotenv/config';
import { prisma } from '../../../database/prisma/seed';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterDTO } from '../dto/register.dto';
import { LoginDTO } from '../dto/login.dto';


export class AuthService {
  async register(data: RegisterDTO) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email déjà utilisé');

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
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

  async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('Email ou mot de passe invalide');

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new Error('Email ou mot de passe invalide');

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      "fdcc0eef-9dfd-45c9-9370-d0ca615b05fb",
      { expiresIn: '7d' }
    );

    return { access_token:token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async getAccount(token:any){

    const decoded = jwt.verify(token, "fdcc0eef-9dfd-45c9-9370-d0ca615b05fb");

    console.log(decoded);
    if(decoded){
        const user = await prisma.user.findUnique({ where: { id: decoded.sub.toString() } });
        if (!user) throw new Error('Utilisateur introuvable');
        console.log(user);
        return user;
    }

  }

  async getUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('Utilisateur introuvable');
    return user;
  }

  async updateUser(id: string, data: any){
    const user = await prisma.user.update({ where: { id }, data });
    return user;
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Utilisateur introuvable');

    // À remplacer par un envoi réel via nodemailer + token de reset
    return { message: `Lien de réinitialisation simulé pour ${email}` };
  }
}
