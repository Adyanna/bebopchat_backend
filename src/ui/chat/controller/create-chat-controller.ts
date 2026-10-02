import { CreateChatUseCase } from '@/domain/chat/use-cases/create-chat';
import { SignupPrismaRepository } from '@/infrastructure/authentication/signupPrismaRepository';
import { PrismaChatRepository } from '@/infrastructure/chat/repositories/PrismaChatRepository';
import { NextFunction, Request, Response } from 'express';
import { length, z } from 'zod';

const createChatValidationSquema = z.object({
    name: z.string().min(4, "min length for title is 4 characters").optional(),
    description: z.string().min(15, "Min length for description is 30 characters").optional(),
    participantIds: z.array(z.number()).min(1)
});


export const createChatController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, participantIds } = createChatValidationSquema.parse(req.body);

        const prismaChatRepository = new PrismaChatRepository();
        const prismaAuthRepository = new SignupPrismaRepository();
        const createChatUseCase = new CreateChatUseCase(prismaChatRepository, prismaAuthRepository);

        const { chat, isNew } = await createChatUseCase.execute({
            creatorId: req.userId!,
            name,
            description,
            participantIds
        });

        res.status(isNew ? 201 : 200).json(chat);

    } catch (error) {
        next(error);
    }
}