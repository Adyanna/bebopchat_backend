
import { Router } from 'express';
import { HealthController } from '@/ui/health/controllers/healthController';

export const healthRoute = Router();

//rverificar funcionamiento
healthRoute.get('/health', HealthController);
