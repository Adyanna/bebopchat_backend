import { authenticationMiddleware } from "@/ui/global/middleware/authMiddleware";
import { Router } from "express";
import { creatChatController } from "../controller/create-chat-controller";


export const chatRouter = Router();

chatRouter.post('/', [creatChatController]);