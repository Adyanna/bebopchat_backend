import express from 'express';
import { errorHandlerMiddleware } from '@/ui/global/middleware/ErrorHandlerMiddleware';
import { healthRoute } from '@/ui/health/route/HealthRoute';

const app = express();

app.use(express.json());
app.use('/', healthRoute);

app.use(errorHandlerMiddleware);
export default app;
