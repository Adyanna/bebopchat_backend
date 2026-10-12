import { CreateMessageUseCase } from "@/domain/message/use-cases/create-message";
import { PrismaChatRepository } from "@/infrastructure/chat/repositories/PrismaChatRepository";
import { PrismaMessageRepository } from "@/infrastructure/message/repositories/PrismaMessageRepository";
import { NextFunction, Request, Response } from "express";
import { createMessageValidationSquema } from "@/ui/message/schemas/messageSchema";
import { io } from '@/app';



export const createMessageController = async (req: Request, res: Response, next: NextFunction) => {


    try {
        const chatId = Number(req.params.id);
        const { content, multimediaUrl } = createMessageValidationSquema.parse(req.body);

        const prismaMessageRepository = new PrismaMessageRepository();
        const prismaChatRepository = new PrismaChatRepository();

        const createMessageUseCase = new CreateMessageUseCase(prismaMessageRepository, prismaChatRepository);

        const message = await createMessageUseCase.execute({
            chatId,
            senderId: req.userId!,
            content,
            multimediaUrl,
        });

        // Obtener los sockets que están dentro de esta conversación.
        // Obtener los participantes de la conversación.
        const chat = await prismaChatRepository.findById(message.chatId);
        console.log("verificar si es grupal", chat)
        if (chat) {
            for (const participant of chat.participants) {
                // No enviar el evento al remitente.
                if (participant.userId === req.userId) {
                    continue;
                }

                // Enviar el mensaje a la sala personal del destinatario.
                io.to(`user:${participant.userId}`)
                    .emit("receive_message", message);
            }
        }

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
}