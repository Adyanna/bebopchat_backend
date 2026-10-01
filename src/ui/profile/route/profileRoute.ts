import { Router } from 'express';

import { authenticationMiddleware } from '@/ui/global/middleware/authMiddleware';

import {createProfileController} from '@/ui/profile/controllers/createProfileController';
import { updateProfileController } from '@/ui/profile/controllers/updateProfileUseCase';
import { deleteProfileController } from '../controllers/deleteProfileController';
import { viewProfileController } from '../controllers/viewProfileController';

export const profileRoute = Router();

console.log("ingresa ruta")
// Crear perfil
profileRoute.post('/', authenticationMiddleware, createProfileController);

// Editar perfil
profileRoute.put('/', authenticationMiddleware, updateProfileController);

// Eliminar perfil
profileRoute.delete('/', authenticationMiddleware, deleteProfileController);

// Ver perfil
profileRoute.get('/', authenticationMiddleware, viewProfileController);

