import { authenticationMiddleware } from "@/ui/global/middleware/authMiddleware";
import { Router } from "express";
import { searchUserController } from "../controller/search-user-controller";
import { getChatsByUserController } from "@/ui/chat/controller/get-chats-by-user-controller";
import { addContactController } from "@/ui/contacts/controller/add-contact-controller";
import { getUserContactsController } from "@/ui/contacts/controller/get-contacts-controller";
import { deleteContactController } from "@/ui/contacts/controller/delete-contact-controller";

export const userRouter = Router();

userRouter.get('/', [authenticationMiddleware, searchUserController]);
userRouter.get('/me/chats', [authenticationMiddleware, getChatsByUserController]);
userRouter.get('/me/contacts', [authenticationMiddleware, getUserContactsController]);
userRouter.post('/me/contacts', [authenticationMiddleware, addContactController]);
userRouter.delete('/me/contacts/:id', [authenticationMiddleware, deleteContactController]);