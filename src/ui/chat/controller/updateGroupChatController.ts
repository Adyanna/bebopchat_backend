import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { PrismaChatRepository } from "@/infrastructure/chat/repositories/PrismaChatRepository";
import { UpdateGroupChatUseCase } from "@/domain/chat/use-cases/update-group-chat";
import { ValidationError } from "@/domain/errors/ValidationError";

export const updateGroupChatSchema = z.object({
    chatId: z.number().int().positive(),
    name: z.string().max(100).optional(),
    description: z.string().max(500).optional(),
}).refine(
    data => data.name !== undefined || data.description !== undefined,
    { message: "At least one field must be provided" }
);


export const updateGroupChatController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        const prismaChatRepository = new PrismaChatRepository();
        const updateGroupChatUseCase = new UpdateGroupChatUseCase(
            prismaChatRepository
        );
        const chatId = Number(req.params.id);

        const result = updateGroupChatSchema.safeParse({
            chatId,
            ...req.body,
        });

        if (!result.success) {
            throw new ValidationError("Invalid group chat data");
        }

        const { name, description } = result.data;

        const chat = await updateGroupChatUseCase.execute({
            chatId,
            userId: req.userId!,
            name,
            description,
        });

        res.status(200).json(chat);
    } catch (error) {
        next(error);
    }
};
