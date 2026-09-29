import { CreateMessageUseCase } from "@/domain/message/use-cases/create-message";
import { PrismaChatRepository } from "@/infrastructure/chat/repositories/PrismaChatRepository";
import { PrismaMessageRepository } from "@/infrastructure/message/repositories/PrismaMessageRepository";
import { NextFunction, Request, Response } from "express";
import { z } from 'zod';

const createMessageValidationSquema = z.object({
    content: z.string().trim().min(1, "Message content is required"),
    //multimediaUrl: z.url().optional()
});



export const createMessageController = async (req: Request, res: Response, next: NextFunction) => {


    try {
        const chatId = Number(req.params.id);
        const { content } = createMessageValidationSquema.parse(req.body);

        const prismaMessageRepository = new PrismaMessageRepository();
        const prismaChatRepository = new PrismaChatRepository();

        const createMessageUseCase = new CreateMessageUseCase(prismaMessageRepository, prismaChatRepository);

        const message = await createMessageUseCase.execute({
            chatId,
            senderId: 1,
            content,
            // multimediaUrl
        });

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
}