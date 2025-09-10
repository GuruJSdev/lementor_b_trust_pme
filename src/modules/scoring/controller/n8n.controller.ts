import { Request, Response } from 'express';
import { N8nService } from '../service/n8nWebhook.service';
import { PmeController } from '../../pme/controller/pme.controller';
import { RapportController } from '../../rapport/controller/rapport.controller';
import { prisma } from '../../../database/prisma/seed';

export class N8nController {

    static async create(req: Request, res: Response) {
        try {
            // const response  = await new N8nService().sendEvaluation(req.body)

            const responsePME = await prisma.pME.findMany({
                where: {
                    nomEntreprise: req.body.nomEntreprise,
                    statutLegal: req.body.statutLegal,
                    secteurActivite: req.body.secteurActivite
                }
            })

            if (responsePME.length == 0) {
                await PmeController.create(req, res)
            }
            else {
                await PmeController.update(req, res)
            }


            // Evaluation 

            const response_create_evaluation = await new N8nService().sendEvaluation(req.body)

            if (response_create_evaluation) {

                const rapport_model = {
                    data: response_create_evaluation,
                    user_id: req.body.user_id,
                    entreprise_id: responsePME[0].id,
                }

                await RapportController.create(JSON.stringify(rapport_model))

                return res.status(201).json({
                    message: "Evaluation envoyée",
                })
            }
        } catch (error) {
            console.log("error", error)
            return res.status(500).json({ error: 'Erreur lors de la création de la PME.' });
        }
    }
}