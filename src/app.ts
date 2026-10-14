import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { socketAuthMiddleware } from '@/ui/chat/socket/socketAuthMiddleware';
import { errorHandlerMiddleware } from '@/ui/global/middleware/ErrorHandlerMiddleware';
import { healthRoute } from '@/ui/health/route/HealthRoute';
import { chatRouter } from './ui/chat/routes/chat-router';
import { authRoute } from '@/ui/authentication/route/authRoute';
import { profileRoute } from '@/ui/profile/route/profileRoute';
import { uploadRoute } from './ui/upload/route/uploadRoute';
import { userRouter } from './ui/users/routes/users-router';

const app = express();

// 1. Envolvemos express en un servidor HTTP nativo de Node
export const httpServer = createServer(app);

// 2. Instanciamos Socket.io sobre el servidor HTTP
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: `http://${process.env.VITE_CLIENT_HOST || 'localhost'}:5173`,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Autenticación de conexiones Socket.IO
io.use(socketAuthMiddleware);

// Middlewares globales
app.use(cors({
  origin: `http://${process.env.VITE_CLIENT_HOST || 'localhost'}:5173`,
  credentials: true,
}));


app.use(express.json());


app.use('/', healthRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use("/users", userRouter);
app.use('/chats', chatRouter);
app.use('/upload',uploadRoute)

// Servir la carpeta uploads de forma pública
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use(errorHandlerMiddleware);
export default app;
