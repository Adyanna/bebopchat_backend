import { GetChatDetailUseCase } from "@/domain/chat/use-cases/get-chat";
import { PrismaChatRepository } from "@/infrastructure/chat/repositories/PrismaChatRepository";
import { NextFunction, Request, Response } from "express";

export const getChatDetailController = async (req: Request, res: Response, next: NextFunction) => {
    const prismaChatRepository = new PrismaChatRepository();
    const getChatDetailUseCase = new GetChatDetailUseCase(prismaChatRepository);

    try {
        const chatId = Number(req.params.id);

        const chat = await getChatDetailUseCase.execute({
            chatId,
            userId: req.userId!
        });

        res.status(200).json(chat)

    } catch (error) {
        next(error);
    }
}