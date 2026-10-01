import { Router } from 'express';
import { signupAuthController } from '@/ui/authentication/controllers/signupController';
import { signinController } from '@/ui/authentication/controllers/singinController';

export const authRoute = Router();

//registro
authRoute.post('/signup', signupAuthController);
//inicio de sesion
authRoute.post('/signin', signinController);
