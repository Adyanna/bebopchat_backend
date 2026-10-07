import express from 'express';
import cors from 'cors';
import path from 'path';
import { errorHandlerMiddleware } from '@/ui/global/middleware/ErrorHandlerMiddleware';
import { healthRoute } from '@/ui/health/route/HealthRoute';
import { chatRouter } from './ui/chat/routes/chat-router';
import { authRoute } from '@/ui/authentication/route/authRoute';
import { profileRoute } from '@/ui/profile/route/profileRoute';
import { userChatsRouter } from './ui/chat/routes/me-router';
import { uploadRoute } from './ui/upload/route/uploadRoute';
import { userRouter } from './ui/users/routes/users-router';

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
app.use("/users", userChatsRouter);
app.use("/users", userRouter);
app.use('/chats', chatRouter);
app.use('/upload', uploadRoute)
// Servir la carpeta uploads de forma pública
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use(errorHandlerMiddleware);
export default app;
