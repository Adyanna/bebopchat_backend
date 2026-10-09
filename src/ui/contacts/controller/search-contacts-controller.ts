import z from "zod";
import { NextFunction, Request, Response } from "express";
import { PrismaContactRepository } from "@/infrastructure/contacts/repositories/PrismaContactRepository";
import { SearchContactUseCase } from "@/domain/contacts/use-cases/search-contact-use-case";


const searchContactsQueryParamsSchemaValidator = z.object({
    search: z.string().trim().min(1, "Search is required"),
    limit: z.coerce.number().positive().max(100).default(30),
    before: z.coerce.number().positive().optional(),
});

export const searchContactsController = async (req: Request, res: Response, next: NextFunction) => {
    const prismaContactRepository = new PrismaContactRepository();
    const searchContactsUseCase = new SearchContactUseCase(prismaContactRepository);

    try {
        const { search, limit, before } = searchContactsQueryParamsSchemaValidator.parse(req.query);
        const { data, hasMore, nextBefore } = await searchContactsUseCase.execute({
            userId: req.userId!,
            search,
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
