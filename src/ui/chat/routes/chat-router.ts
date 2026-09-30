import { Router } from "express";
import { createChatController } from "../controller/create-chat-controller";
import { createMessageController } from "@/ui/message/controller/create-message-controller";
import { editMessageController } from "@/ui/message/controller/edit-message-controller";
import { deleteMessageController } from "@/ui/message/controller/delete-message-controller";


export const chatRouter = Router();

chatRouter.post('/', [createChatController]);
chatRouter.post('/:id/messages', [createMessageController]);
chatRouter.patch('/:id/messages/:messageId', [editMessageController]);
chatRouter.delete('/:id/messages/:messageId', [deleteMessageController]);