import { EditMessageUseCase } from "@/domain/message/use-cases/edit-message";
import { PrismaMessageRepository } from "@/infrastructure/message/repositories/PrismaMessageRepository";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const editMessageValidationSquema = z.object({
    newContent: z.string().trim().min(1, "Message content is required"),
})

export const editMessageController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chatId = Number(req.params.id);
        const messageId = Number(req.params.messageId);
        const { newContent } = editMessageValidationSquema.parse(req.body);

        const prismaMessageRepository = new PrismaMessageRepository();
        const editMessageUseCase = new EditMessageUseCase(prismaMessageRepository);

        const message = await editMessageUseCase.execute({
            chatId,
            userId: req.userId!,
            messageId,
            newContent
        });

        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
}