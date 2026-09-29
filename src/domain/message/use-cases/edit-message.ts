import { MessageRepository } from "../repositories/MessageRepository";
import { ChatRepository } from "@/domain/chat/repositories/ChatRepository";
import { InvalidOperationError } from "@/domain/errors/ValidationError";
import { Message } from "../Message";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
export interface EditMessageUseCaseInput {
    chatId: number;
    userId: number;
    messageId: number
    newContent: string;
}

export class EditMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly chatRepository: ChatRepository
    ) { }

    async execute(input: EditMessageUseCaseInput): Promise<Message> {
        const chatExists = await this.chatRepository.findById(input.chatId);

        if (!chatExists) {
            throw new InvalidOperationError("Non-existent Chat")
        }

        const userIsParticipant = chatExists.participants.
            some((paricipant) => paricipant.userId === input.userId)

        if (!userIsParticipant) {
            throw new UnauthorizedError("You're not a participant in this chat")
        }

        const messageExists = await this.messageRepository.findById(input.messageId);

        if (!messageExists) {
            throw new InvalidOperationError("Non-existent Messsage")
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