import { MessageRepository } from "@/domain/message/repositories/MessageRepository";
import { StatusType } from "@prisma/client";

export type UpdatePendingMessagesUseCaseInput = {
    userId: number;
};

export class UpdatePendingMessagesUseCase {
    constructor(
        private readonly messageRepository: MessageRepository
    ) {}

    async execute(params: UpdatePendingMessagesUseCaseInput) {
        console.log("INGRESO AL METODO EN DOMAIN USECASES: ", params.userId)
        return this.messageRepository.updatePendingMessages(params.userId);
    }
}