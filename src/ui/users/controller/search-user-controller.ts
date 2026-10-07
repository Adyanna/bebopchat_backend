import { z } from "zod";
import { NextFunction, Request, Response } from 'express';
import { PrismaUserRepository } from "@/infrastructure/users/PrismaUserRepository";
import { SearchUserUseCase } from "@/domain/users/use-cases/SearchUserUseCase";


const searchUserValidationSquema = z.object({
    phone: z.string().regex(/^\d{10,15}$/, 'The phone provided is incorrect'),
});

export const searchUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phone } = searchUserValidationSquema.parse(req.body);

        const prismaUserRepository = new PrismaUserRepository();
        const searchUserUseCase = new SearchUserUseCase(prismaUserRepository);

        const user = await searchUserUseCase.execute(phone);

        const response = {
            id: user.id,
            fullname: user.fullname,
            phone: user.phone
        }

        res.status(200).json(response);

    } catch (error) {
        next(error);
    }
}