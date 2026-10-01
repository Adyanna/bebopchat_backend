import { Router } from "express";
import { createChatController } from "../controller/create-chat-controller";
import { createMessageController } from "@/ui/message/controller/create-message-controller";
import { editMessageController } from "@/ui/message/controller/edit-message-controller";
import { deleteMessageController } from "@/ui/message/controller/delete-message-controller";
import { getMessagesByChatIdController } from "@/ui/message/controller/get-messages-controller";
import { getChatDetailController } from "../controller/get-chat-controller";
import { authenticationMiddleware } from "@/ui/global/middleware/authMiddleware";


export const chatRouter = Router();

chatRouter.post('/', [authenticationMiddleware, createChatController]);
chatRouter.get('/:id/', [authenticationMiddleware, getChatDetailController]);
chatRouter.get('/:id/messages', [authenticationMiddleware, getMessagesByChatIdController]);
chatRouter.post('/:id/messages', [authenticationMiddleware, createMessageController]);
chatRouter.patch('/:id/messages/:messageId', [authenticationMiddleware, editMessageController]);
chatRouter.delete('/:id/messages/:messageId', [authenticationMiddleware, deleteMessageController]);