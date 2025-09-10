"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nController = void 0;
const n8nWebhook_service_1 = require("../service/n8nWebhook.service");
const pme_controller_1 = require("../../pme/controller/pme.controller");
class N8nController {
    static async create(req, res) {
        try {
            const response = await new n8nWebhook_service_1.N8nService().sendEvaluation(req.body);
            if (response) {
                // ===== tech ====
                const dataLog = {};
                await pme_controller_1.PmeController.create(req, res);
                return res.status(201).json(response);
            }
            else {
                return res.status(400).json({ error: 'n8n error' });
            }
        }
        catch (error) {
            console.log("error", error);
            return res.status(500).json({ error: 'Erreur lors de la création de la PME.' });
        }
    }
}
exports.N8nController = N8nController;
