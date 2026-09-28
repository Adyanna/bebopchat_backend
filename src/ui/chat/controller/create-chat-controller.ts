import { CreateChatUseCase } from '@/domain/chat/use-cases/create-chat';
import { PrismaChatRepository } from '@/infrastructure/chat/repositories/PrismaChatRepository';
import { NextFunction, Request, Response } from 'express';
import { length, z } from 'zod';

const createChatValidationSquema = z.object({
    name: z.string().min(4, "min length for title is 4 characters").optional(),
    description: z.string().min(30, "Min length for description is 30 characters").optional(),
    participantIds: z.array(z.number()).min(1)
});


export const creatChatController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, participantIds } = createChatValidationSquema.parse(req.body);

        const prismaChatRepository = new PrismaChatRepository();
        const createChatUseCase = new CreateChatUseCase(prismaChatRepository)

        const newChat = await createChatUseCase.execute({
            creatorId: req.userId!,
            name,
            description,
            participantIds
        });

    } catch (error) {
        next(error);
    }
}