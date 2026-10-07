import { authenticationMiddleware } from "@/ui/global/middleware/authMiddleware";
import { Router } from "express";
import { getChatsByUserController } from "../controller/get-chats-by-user-controller";


export const userChatsRouter = Router();

userChatsRouter.get('/me/chats', [authenticationMiddleware, getChatsByUserController]);