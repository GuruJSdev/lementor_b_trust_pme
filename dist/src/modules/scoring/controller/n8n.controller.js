"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nController = void 0;
const n8nWebhook_service_1 = require("../service/n8nWebhook.service");
const pme_controller_1 = require("../../pme/controller/pme.controller");
const rapport_controller_1 = require("../../rapport/controller/rapport.controller");
const seed_1 = require("../../../database/prisma/seed");
class N8nController {
    static async create(req, res) {
        try {
            // const response  = await new N8nService().sendEvaluation(req.body)
            const responsePME = await seed_1.prisma.pME.findMany({
                where: {
                    nomEntreprise: req.body.nomEntreprise,
                    statutLegal: req.body.statutLegal,
                    secteurActivite: req.body.secteurActivite
                }
            });
            if (responsePME.length == 0) {
                await pme_controller_1.PmeController.create(req, res);
            }
            else {
                await pme_controller_1.PmeController.update(req, res);
            }
            // Evaluation 
            const response_create_evaluation = await new n8nWebhook_service_1.N8nService().sendEvaluation(req.body);
            if (response_create_evaluation) {
                const rapport_model = {
                    data: response_create_evaluation,
                    user_id: req.body.user_id,
                    entreprise_id: responsePME[0].id,
                };
                await rapport_controller_1.RapportController.create(JSON.stringify(rapport_model));
                return res.status(201).json({
                    message: "Evaluation envoyée",
                });
            }
        }
        catch (error) {
            console.log("error", error);
            return res.status(500).json({ error: 'Erreur lors de la création de la PME.' });
        }
    }
}
exports.N8nController = N8nController;
