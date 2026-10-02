import { authenticationMiddleware } from "@/ui/global/middleware/authMiddleware";
import { Router } from "express";
import { getChatsByUserController } from "../controller/get-chats-by-user-controller";


export const userRouter = Router();

userRouter.get('/me/chats', [authenticationMiddleware, getChatsByUserController]);