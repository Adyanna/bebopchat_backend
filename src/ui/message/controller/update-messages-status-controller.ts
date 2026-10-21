import { UpdateMessageStatusUseCase } from "@/domain/message/use-cases/update-message-status";
import { PrismaMessageRepository } from "@/infrastructure/message/repositories/PrismaMessageRepository";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { StatusType } from "@prisma/client";
import { io } from '@/app';

const updateMessageStatusValidationSchema = z.object({
    status: z.nativeEnum(StatusType),
});

export const updateMessageStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const messageId = Number(req.params.messageId);
        const { status } = updateMessageStatusValidationSchema.parse(req.body);

        const prismaMessageRepository = new PrismaMessageRepository();
        const updateMessageStatusUseCase = new UpdateMessageStatusUseCase(
            prismaMessageRepository
        );

        const data = await updateMessageStatusUseCase.execute({
            messageId,
            status,
            userId: Number(req.userId),
        });
        // controlar si es individual o grupal y si es grupal si lo vio toditos
        if (data.chatType === "INDIVIDUAL" || (data.chatType === "GROUP" && data.message.status === "VIEW") )
            {
            // mantener el evento solo si corresponde al estado final
            io.to(`user:${data.message.senderId}`).emit("message_status_updated", {
                chatId: data.message.chatId,
                messageId: data.message.id,
                status: data.message.status,
            });
        }

        res.status(200).json(data.message);
    } catch (error) {
        next(error);
    }
};