import { Router , Request,Response } from 'express';
// import { N8nService } from './service/n8nWebhook.service';
import { authGuard } from '../auth/auth.guard';
import { N8nController } from './controller/n8n.controller';
import {RapportController} from "../rapport/controller/rapport.controller"

const router = Router();

router.post('/',authGuard, N8nController.create);
router.get('/',authGuard, RapportController.getAll);


export default router;