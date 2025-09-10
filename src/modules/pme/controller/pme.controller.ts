import { Request, Response } from 'express';
import { prisma } from '../../../database/prisma/seed';
import { CreatePMEDto } from  "../dto/createPme.dto";
import jwt from 'jsonwebtoken';

export class PmeController {

  static async create(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
      if (!token) {
        return res.status(401).json({ error: 'Token manquant.' });
      }

      let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, "fdcc0eef-9dfd-45c9-9370-d0ca615b05fb");
      } catch (err) {
        return res.status(401).json({ error: 'Token invalide ou expiré.' });
      }

      // console.log("decodedToken",decodedToken)

      const user_id = decodedToken.sub;
      if (!user_id) {
        return res.status(400).json({ error: 'user_id introuvable dans le token.' });
      }

      const data_pme: CreatePMEDto = req.body;

      const newPme = await prisma.pME.create({
        data: {
          ...data_pme,
          user_id: user_id, // si tu veux le lier à un utilisateur
        },
      });

      return res.status(201).json(newPme);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur lors de la création de la PME.' });
    }
  }

  // Lire toutes les PME
  static async findAll(req: Request, res: Response) {
    try {
      const response_user_id = req.params.user_id
      const pmes = await prisma.pME.findMany({ where: { user_id: response_user_id } });
      return res.status(200).json(pmes);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des PME.' });
    }
  }

// Lire toutes les PME d’un utilisateur
static async findByUserId(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const pmes = await prisma.pME.findMany({ where: { user_id: id } });

    if (pmes.length === 0) {
      return res.status(404).json({ error: 'Aucune PME trouvée pour cet utilisateur' });
    }

    return res.status(200).json(pmes);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}


  // Mettre à jour une PME
static async update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data: Partial<CreatePMEDto> = req.body;

    // Vérification si la PME existe
    const existingPme = await prisma.pME.findUnique({ where: { id } });

    if (!existingPme) {
      return res.status(404).json({ error: 'PME non trouvée pour mise à jour.' });
    }

    // Mise à jour uniquement si la PME existe
    const updatedPme = await prisma.pME.update({
      where: { id },
      data,
    });

    return res.status(200).json(updatedPme);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
}


  // Supprimer une PME
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.pME.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  }
}