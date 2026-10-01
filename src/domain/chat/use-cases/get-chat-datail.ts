import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { Chat } from "../Chat";
import { ChatRepository } from "../repositories/ChatRepository";
import { InvalidOperationError } from "@/domain/errors/ValidationError";
import { EntityNotFoundError } from "@/domain/errors/EntityNotFoundError";



export interface GetChatDetailUseCaseInput {
    chatId: number;
    userId: number;
}

export class GetChatDetailUseCase {
    constructor(
        private readonly chatRepository: ChatRepository
    ) { }

    async execute(input: GetChatDetailUseCaseInput): Promise<Chat> {
        const chat = await this.chatRepository.findById(input.chatId);
        if (!chat) {
            throw new EntityNotFoundError('Chat', input.chatId.toString());
        }

        const userIsParticipant = chat.participants.
            some((paricipant) => paricipant.userId === input.userId);

        if (!userIsParticipant) {
            throw new UnauthorizedError("Your not a participant in this chat");
        }

        return chat;
    }
}