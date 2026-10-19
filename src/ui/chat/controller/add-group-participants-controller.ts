import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { PrismaUserRepository } from "@/infrastructure/users/repositories/PrismaUserRepository";
import { PrismaChatRepository } from "@/infrastructure/chat/repositories/PrismaChatRepository";
import { AddGroupParticipantsUseCase } from "@/domain/chat/use-cases/add-group-participants";
import { ValidationError } from "@/domain/errors/ValidationError";

export const addGroupParticipantsSchema = z.object({
    chatId: z.number().int().positive(),
    userContactIds: z.array(z.number().int().positive()).min(1)
});


export const addGroupParticipantsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        const prismaUserRepository = new PrismaUserRepository();
        const prismaChatRepository = new PrismaChatRepository();

        const addGroupParticipantsUseCase = new AddGroupParticipantsUseCase(prismaChatRepository,
            prismaUserRepository
        );
        const chatId = Number(req.params.id);

        const result = addGroupParticipantsSchema.safeParse({
            chatId,
            ...req.body
        });

        if (!result.success) {
            throw new ValidationError("Invalid group chat data");
        }

        const { userContactIds } = result.data;

        const updatedChat = await addGroupParticipantsUseCase.execute({
            chatId,
            userId: req.userId!,
            userContactIds
        });

        res.status(200).json(updatedChat);

    } catch (error) {
        next(error);
    }

}