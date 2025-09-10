import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();


import authRoutes from './modules/auth/routes';
import pmeRoutes from "./modules/pme/routes"
import n8nRoutes from "./modules/scoring/routes"

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/pme', pmeRoutes);
app.use('/api/scoring',n8nRoutes);

export default app;
