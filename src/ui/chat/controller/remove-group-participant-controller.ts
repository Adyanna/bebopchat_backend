import { NextFunction, Request, Response } from "express";
import { ValidationError } from "@/domain/errors/ValidationError";
import { z } from "zod";
import { PrismaChatRepository } from "@/infrastructure/chat/repositories/PrismaChatRepository";
import { RemoveGroupParticipantUseCase } from "@/domain/chat/use-cases/remove-group-participant";

export const removeGroupParticipantSchema = z.object({
    chatId: z.number().int().positive(),
    participantId: z.number().int().positive(),
});

export const removeGroupParticipantController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const prismaChatRepository = new PrismaChatRepository();
    const removeGroupParticipantUseCase =
        new RemoveGroupParticipantUseCase(prismaChatRepository);

    try {
        const chatId = Number(req.params.id);
        const participantId = Number(req.params.userId);

        const result = removeGroupParticipantSchema.safeParse({
            chatId,
            participantId,
        });

        if (!result.success) {
            throw new ValidationError("Invalid group participant data");
        }

        await removeGroupParticipantUseCase.execute({
            chatId: result.data.chatId,
            userId: req.userId!,
            participantId: result.data.participantId,
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
