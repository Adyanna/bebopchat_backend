import { DeleteMessageUseCase } from "@/domain/message/use-cases/delete-message";
import { PrismaMessageRepository } from "@/infrastructure/message/repositories/PrismaMessageRepository";
import { NextFunction, Request, Response } from "express";

export const deleteMessageController = async (req: Request, res: Response, next: NextFunction) => {
    const prismaMessageRepository = new PrismaMessageRepository();
    const deleteMessageUseCase = new DeleteMessageUseCase(prismaMessageRepository);

    try {
        const chatId = Number(req.params.id);
        const messageId = Number(req.params.messageId);

        await deleteMessageUseCase.execute({
            messageId,
            userId: 1,
            chatId
        });

        res.status(204).send();

    } catch (error) {
        next(error);
    }
}