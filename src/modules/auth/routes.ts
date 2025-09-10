import { Router } from 'express';
import { AuthController } from './controller/auth.controller';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/account', AuthController.getAccount);
router.post('/forgot-password', AuthController.forgotPassword);

export default router;
