import { MessageRepository } from "@/domain/message/repositories/MessageRepository";
import { StatusType } from "@prisma/client";

export type UpdateMessageStatusUseCaseInput = {
    messageId: number;
    status: StatusType;
    userId: number;
};

export class UpdateMessageStatusUseCase {
    constructor(
        private readonly messageRepository: MessageRepository
    ) {}

    async execute(params: UpdateMessageStatusUseCaseInput) {
        return this.messageRepository.updateMessageStatus(
            params.messageId,
            params.status,
            params.userId
        );
    }
}