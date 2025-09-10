"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RapportController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RapportController {
    // Récupérer tous les rapports
    static async getAll(req, res) {
        try {
            const rapports = await prisma.rapport.findMany({
                orderBy: { createdAt: "desc" },
            });
            res.json(rapports);
        }
        catch (error) {
            console.error("[RapportController] getAll error:", error);
            res.status(500).json({ message: "Erreur lors de la récupération des rapports" });
        }
    }
    // Récupérer un rapport par id
    static async getOne(req, res) {
        const { id } = req.params;
        try {
            const rapport = await prisma.rapport.findUnique({ where: { id } });
            if (!rapport)
                return res.status(404).json({ message: "Rapport non trouvé" });
            res.json(rapport);
        }
        catch (error) {
            console.error("[RapportController] getOne error:", error);
            res.status(500).json({ message: "Erreur lors de la récupération du rapport" });
        }
    }
    // Créer un nouveau rapport
    static async create(req, res) {
        const { data } = req.body;
        if (!data)
            return res.status(400).json({ message: "Le champ 'data' est obligatoire" });
        try {
            const newRapport = await prisma.rapport.create({ data: { data } });
            res.status(201).json(newRapport);
        }
        catch (error) {
            console.error("[RapportController] create error:", error);
            res.status(500).json({ message: "Erreur lors de la création du rapport" });
        }
    }
    // Mettre à jour un rapport
    static async update(req, res) {
        const { id } = req.params;
        const { data } = req.body;
        try {
            const updatedRapport = await prisma.rapport.update({
                where: { id },
                data: { data },
            });
            res.json(updatedRapport);
        }
        catch (error) {
            console.error("[RapportController] update error:", error);
            res.status(500).json({ message: "Erreur lors de la mise à jour du rapport" });
        }
    }
    // Supprimer un rapport
    static async delete(req, res) {
        const { id } = req.params;
        try {
            await prisma.rapport.delete({ where: { id } });
            res.json({ message: "Rapport supprimé avec succès" });
        }
        catch (error) {
            console.error("[RapportController] delete error:", error);
            res.status(500).json({ message: "Erreur lors de la suppression du rapport" });
        }
    }
}
exports.RapportController = RapportController;
