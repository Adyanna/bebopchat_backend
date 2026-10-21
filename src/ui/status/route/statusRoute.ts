import { Router } from 'express';

import { createStatusController } from '@/ui/status/controllers/createStatusController';
import { deleteStatusController } from '@/ui/status/controllers/deleteStatusController';
import { createViewStatusController } from '@/ui/status/controllers/createViewStatusController';
import { getMyStatusController } from '@/ui/status/controllers/getMyStatusController';
import { getStatusContactosController } from '@/ui/status/controllers/getStatusContactsController';
import { authenticationMiddleware } from '@/ui/global/middleware/authMiddleware';

export const statusRouter = Router();

statusRouter.post('/',authenticationMiddleware, createStatusController);
statusRouter.delete('/:estadoId',authenticationMiddleware, deleteStatusController);

statusRouter.post('/:estadoId/views',authenticationMiddleware, createViewStatusController);

statusRouter.get('/my',authenticationMiddleware, getMyStatusController);
statusRouter.get('/contacts',authenticationMiddleware, getStatusContactosController);
