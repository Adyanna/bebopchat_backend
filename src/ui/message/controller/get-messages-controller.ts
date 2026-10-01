import { GetMessagesByChatUseCase } from "@/domain/message/use-cases/get-messages";
import { PrismaChatRepository } from "@/infrastructure/chat/repositories/PrismaChatRepository";
import { PrismaMessageRepository } from "@/infrastructure/message/repositories/PrismaMessageRepository";
import { NextFunction, Request, Response } from "express";
import { CursorPaginatedResponse } from "../../global/types/CursorPaginatedResponse"
import { z } from "zod";
import { Message } from "@/domain/message/Message";

const getMessageQueryParamsSchemaValidator = z.object({
    before: z.coerce.number().positive().optional(),
    limit: z.coerce.number().positive().max(100).default(30),
});

export const getMessagesByChatIdController = async (req: Request, res: Response, next: NextFunction) => {
    const prismaMessageRepository = new PrismaMessageRepository();
    const prismaChatRepository = new PrismaChatRepository();
    const getMessagesByChatUseCase = new GetMessagesByChatUseCase(prismaMessageRepository, prismaChatRepository);

    try {
        const chatId = Number(req.params.id)
        const { limit, before } = getMessageQueryParamsSchemaValidator.parse(req.query);
        const messages = await getMessagesByChatUseCase.execute({
            chatId,
            userId: 1,
            before,
            limit
        });

        const response: CursorPaginatedResponse<Message> = {
            data: messages,
            meta: {
                limit
            }
        }

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
