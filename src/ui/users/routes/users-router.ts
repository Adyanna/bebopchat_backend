import { authenticationMiddleware } from "@/ui/global/middleware/authMiddleware";
import { Router } from "express";
import { searchUserController } from "../controller/search-user-controller";
import { getChatsByUserController } from "@/ui/chat/controller/get-chats-by-user-controller";

export const userRouter = Router();

userRouter.get('/', [authenticationMiddleware, searchUserController]);
userRouter.get('/me/chats', [authenticationMiddleware, getChatsByUserController]);