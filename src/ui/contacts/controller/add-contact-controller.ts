import z from "zod";
import { NextFunction, Request, Response } from "express";
import { PrismaContactRepository } from "@/infrastructure/contacts/repositories/PrismaContactRepository";
import { PrismaUserRepository } from "@/infrastructure/users/repositories/PrismaUserRepository";
import { AddContactUseCase } from "@/domain/contacts/use-cases/add-contact-use-case";

const addContactValidationSquema = z.object({
    targetId: z.coerce.number().positive()
})

export const addContactController = async (req: Request, res: Response, next: NextFunction) => {
    const prismaContactRepository = new PrismaContactRepository();
    const prismaUserRepository = new PrismaUserRepository();

    const addContactUseCase = new AddContactUseCase(prismaContactRepository, prismaUserRepository);

    try {
        const { targetId } = addContactValidationSquema.parse(req.body);

        const { user } = await addContactUseCase.execute({
            targetId,
            userId: req.userId!
        });

        const response = {
            id: user.id,
            fullname: user.fullname,
            phone: user.phone
        }

        res.status(201).json(response);

    } catch (error) {
        next(error);
    }
}

