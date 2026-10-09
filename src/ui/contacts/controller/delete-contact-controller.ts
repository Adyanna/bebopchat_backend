import { DeleteContactUseCase } from "@/domain/contacts/use-cases/delete-contact-use-case";
import { PrismaContactRepository } from "@/infrastructure/contacts/repositories/PrismaContactRepository";
import { NextFunction, Request, Response } from "express";


export const deleteContactController = async (req: Request, res: Response, next: NextFunction) => {
    const prismaContactRepository = new PrismaContactRepository();
    const deleteContactUseCaseInput = new DeleteContactUseCase(prismaContactRepository);

    try {
        const userContactId = Number(req.params.id);

        await deleteContactUseCaseInput.execute({
            userId: req.userId!,
            userContactId
        });

        res.status(204).send();

    } catch (error) {
        next(error);
    }
}