import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';

const authService = new AuthService();

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

async getAccount(req: Request, res: Response) {
  try {
    // Récupère l'authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token manquant ou invalide" });
    }

    // Extraire le token du header
    const token = authHeader.split(" ")[1];
    console.log(token);
    // Appeler ton service avec le token
    const result = await authService.getAccount(token);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
},


  async getUser(req: Request, res: Response){

    try {
      const result = await authService.getUser(req.body.id);
      res.status(200).json(result); 
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const result = await authService.forgotPassword(req.body.email);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
