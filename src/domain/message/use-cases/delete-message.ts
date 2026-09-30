import { EntityNotFoundError } from "@/domain/errors/EntityNotFoundError";
import { MessageRepository } from "../repositories/MessageRepository";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { InvalidOperationError } from "@/domain/errors/ValidationError";


export interface DeleteMessageUseCaseInput {
    messageId: number,
    userId: number,
    chatId: number
}

export class DeleteMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository
    ) { };

    async execute(input: DeleteMessageUseCaseInput) {
        const message = await this.messageRepository.findById(input.messageId);
        if (!message) {
            throw new EntityNotFoundError('Message', input.messageId.toString())
        }
        if (input.chatId !== message.chatId) {
            throw new InvalidOperationError("This message doesn't belong to this chat");
        }

        if (input.userId !== message.senderId) {
            throw new UnauthorizedError("you're not the message owner");
        }

        await this.messageRepository.deleteMessage(input.messageId);
    }
}