import { Router } from 'express';

import { authenticationMiddleware } from '@/ui/global/middleware/authMiddleware';

import {uploadFileController} from '@/ui/upload/controllers/uploadController';
import {uploadSingleFile} from '@/ui/upload/middleware/uploadMiddleware';
import { deleteFileController } from '@/ui/upload/controllers/deleteController';


export const uploadRoute = Router();

uploadRoute.post('/', authenticationMiddleware, uploadSingleFile, uploadFileController);
uploadRoute.delete('/', authenticationMiddleware,deleteFileController);


