"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nService = void 0;
const axios_1 = __importDefault(require("axios"));
class N8nService {
    async sendEvaluation(data) {
        // const url = process.env.N8N_WEBHOOK_URL; 
        const url = "https://n8n.srv864892.hstgr.cloud/webhook-test/trust-pme-evaluation";
        try {
            const response = await axios_1.default.post(url, data);
            return response.data;
        }
        catch (error) {
            console.error('Erreur lors de l’appel à n8n', error);
            throw new Error('Erreur n8n');
        }
    }
}
exports.N8nService = N8nService;
