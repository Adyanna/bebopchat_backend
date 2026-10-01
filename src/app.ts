import express from 'express';
import cors from 'cors';
import { errorHandlerMiddleware } from '@/ui/global/middleware/ErrorHandlerMiddleware';
import { healthRoute } from '@/ui/health/route/HealthRoute';
import { chatRouter } from './ui/chat/routes/chat-router';
import { authRoute } from '@/ui/authentication/route/authRoute';
import { profileRoute } from '@/ui/profile/route/profileRoute';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());




app.use((req, res, next) => {
  console.log("🔥 REQUEST:", req.method, req.originalUrl);
  next();
});
app.use('/', healthRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use('/chats', chatRouter);
app.use(errorHandlerMiddleware);
export default app;
