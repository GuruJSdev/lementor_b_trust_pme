import { Router } from 'express';
import { PmeController } from './controller/pme.controller';
import { authGuard } from '../auth/auth.guard';

const router = Router();

router.post('/',authGuard, PmeController.create);
router.get('/',authGuard, PmeController.findAll);
router.get('/:id',authGuard, PmeController.findByUserId);
router.put('/:id',authGuard, PmeController.update);
router.delete('/:id',authGuard, PmeController.delete);

export default router;