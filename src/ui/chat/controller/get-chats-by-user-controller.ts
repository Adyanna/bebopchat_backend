import { PrismaChatRepository } from "@/infrastructure/chat/repositories/PrismaChatRepository";
import { NextFunction, Request, Response } from "express";
import { CursorPaginatedResponse } from "../../global/types/CursorPaginatedResponse"
import { z } from "zod";
import { GetChatsByUserUseCase } from "@/domain/chat/use-cases/get-chats-by-user";
import { Chat } from "@/domain/chat/Chat";

const getChatsByUserValidationSchema = z.object({
    limit: z.coerce.number().positive().max(100).default(30),
});

export const getChatsByUserController = async (req: Request, res: Response, next: NextFunction) => {
    const prismaChatRepository = new PrismaChatRepository();
    const getChatsByUserUseCase = new GetChatsByUserUseCase(prismaChatRepository);

    try {
        const { limit } = getChatsByUserValidationSchema.parse(req.query);
        const chats = await getChatsByUserUseCase.execute({
            userId: req.userId!,
            limit
        });

        const response: CursorPaginatedResponse<Chat> = {
            data: chats,
            meta: {
                limit
            }
        }

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
