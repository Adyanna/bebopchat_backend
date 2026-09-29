import express from 'express';
import { errorHandlerMiddleware } from '@/ui/global/middleware/ErrorHandlerMiddleware';
import { healthRoute } from '@/ui/health/route/HealthRoute';
import { chatRouter } from './ui/chat/routes/chat-router';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log("🔥 REQUEST:", req.method, req.originalUrl);
    next();
});
app.use('/', healthRoute);
app.use('/chats', chatRouter);
app.use(errorHandlerMiddleware);
export default app;
