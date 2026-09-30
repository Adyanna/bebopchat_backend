import { MessageRepository } from "../repositories/MessageRepository";
import { ChatRepository } from "@/domain/chat/repositories/ChatRepository";
import { InvalidOperationError } from "@/domain/errors/ValidationError";
import { Message } from "../Message";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { EntityNotFoundError } from "@/domain/errors/EntityNotFoundError";
export interface EditMessageUseCaseInput {
    chatId: number;
    userId: number;
    messageId: number
    newContent: string;
}

export class EditMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
    ) { }

    async execute(input: EditMessageUseCaseInput): Promise<Message> {

        const messageExists = await this.messageRepository.findById(input.messageId);

        if (!messageExists) {
            throw new EntityNotFoundError('Message', input.messageId.toString())
        }

        if (messageExists.chatId !== input.chatId) {
            throw new InvalidOperationError(
                "This message doesn't belong to this chat"
            );
        }

        if (input.userId !== messageExists.senderId) {
            throw new UnauthorizedError("You're not the message owner")
        }

        const editedMessage = await this.messageRepository.editMessage(input);

        return editedMessage;
    }
}