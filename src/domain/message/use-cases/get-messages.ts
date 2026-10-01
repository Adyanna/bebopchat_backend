import { Pagination } from "@/domain/global/Pagination"
import { MessageRepository } from "../repositories/MessageRepository";
import { ChatRepository } from "@/domain/chat/repositories/ChatRepository";
import { InvalidOperationError } from "@/domain/errors/ValidationError";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { Message } from "../Message";


export interface MessagesHistory {
    chatId: number;
    userId: number;
}

export type GetMessagesByChatInput = MessagesHistory & Pagination;

export class GetMessagesByChatUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly chatRepository: ChatRepository
    ) { }

    async execute(input: GetMessagesByChatInput):
        Promise<Message[]> {

        const chat = await this.chatRepository.findById(input.chatId);

        if (!chat) {
            throw new InvalidOperationError("chat not found")
        }

        const userIsParticipant = chat.participants.
            some((paricipant) => paricipant.userId === input.userId);

        if (!userIsParticipant) {
            throw new UnauthorizedError("Your not a participant in this chat");
        }

        const messages = await this.messageRepository.getMessagesByChatId(input);

        return messages
    }
}