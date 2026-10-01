import express from 'express';
import { errorHandlerMiddleware } from '@/ui/global/middleware/ErrorHandlerMiddleware';
import { healthRoute } from '@/ui/health/route/HealthRoute';
import { authRoute } from '@/ui/authentication/route/authRoute';
import { profileRoute } from '@/ui/profile/route/profileRoute';

const app = express();

app.use(express.json());
app.use('/', healthRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);


app.use(errorHandlerMiddleware);
export default app;
