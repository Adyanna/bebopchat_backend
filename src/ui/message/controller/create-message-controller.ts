import { CreateMessageUseCase } from "@/domain/message/use-cases/create-message";
import { PrismaChatRepository } from "@/infrastructure/chat/repositories/PrismaChatRepository";
import { PrismaMessageRepository } from "@/infrastructure/message/repositories/PrismaMessageRepository";
import { NextFunction, Request, Response } from "express";
import { z } from 'zod';

const createMessageValidationSquema = z.object({
    //TO DO: Usar superRefine para evitar mensajes vacios, temporalmente
    //puesto asi para implementar multimedia sin content
    content: z.string().trim(),
    multimediaUrl: z.url().optional()
}).superRefine((data, ctx) => {
    if (!data.content && !data.multimediaUrl) {
        ctx.addIssue({
            code: "custom",
            message: "The message must contain text or a multimedia file",
            path: ["content"]
        });
    }
})



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

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
}