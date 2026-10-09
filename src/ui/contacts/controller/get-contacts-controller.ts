import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { PrismaContactRepository } from "@/infrastructure/contacts/repositories/PrismaContactRepository";
import { GetUserContactsUseCase } from "@/domain/contacts/use-cases/get-user-contacts";

const getContactsQueryParamsSchemaValidator = z.object({
    limit: z.coerce.number().positive().max(100).default(30),
    before: z.coerce.number().positive().optional(),
});

export const getUserContactsController = async (req: Request, res: Response, next: NextFunction) => {
    const prismaContactRepository = new PrismaContactRepository();
    const getUserContactsUseCase = new GetUserContactsUseCase(prismaContactRepository)

    try {
        const { limit, before } = getContactsQueryParamsSchemaValidator.parse(req.query);
        const { data, hasMore, nextBefore } = await getUserContactsUseCase.execute({
            userId: req.userId!,
            before,
            limit
        });

        const response = {
            data,
            hasMore,
            meta: {
                limit,
                nextBefore
            }
        }

        res.status(200).json(response);

    } catch (error) {
        next(error)
    }

}
