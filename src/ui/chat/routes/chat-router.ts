import { Router } from "express";
import { createChatController } from "../controller/create-chat-controller";
import { createMessageController } from "@/ui/message/controller/create-message-controller";


export const chatRouter = Router();

chatRouter.post('/', [createChatController]);
chatRouter.post('/:id/messages', [createMessageController]);