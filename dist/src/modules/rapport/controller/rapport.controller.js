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
    static async getLastByUser(req, res) {
        const { user_id } = req.params; // récupéré depuis l'URL
        try {
            const rapport = await prisma.rapport.findFirst({
                where: { user_id: user_id },
                orderBy: { createdAt: "desc" }, // trie par date décroissante
            });
            if (!rapport) {
                return res.status(404).json({ message: "Aucun rapport trouvé pour cet utilisateur" });
            }
            res.json(rapport);
        }
        catch (error) {
            console.error("[RapportController] getLastByUser error:", error);
            res.status(500).json({ message: "Erreur lors de la récupération du dernier rapport" });
        }
    }
    // Créer un nouveau rapport
    static async create(rapport_model) {
        if (!rapport_model)
            return;
        try {
            const newRapport = await prisma.rapport.create({
                data: {
                    data: rapport_model.data, // JSON
                    user_id: rapport_model.user_id, // string
                    entreprise_id: rapport_model.entreprise_id, // string
                    // createdAt sera automatique si défini @default(now()) dans Prisma
                }
            });
            return newRapport;
        }
        catch (error) {
            console.error("[RapportController] create error:", error);
            return error;
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
