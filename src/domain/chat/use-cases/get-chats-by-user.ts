import { Pagination } from "@/domain/global/Pagination";
import { ChatRepository } from "../repositories/ChatRepository";
import { Chat } from "../Chat";


export type GetChatsByUserUseCaseInput = Pagination & {
    userId: number;
};

export class GetChatsByUserUseCase {
    constructor(
        private readonly chatRepository: ChatRepository
    ) {

    }

    async execute(input: GetChatsByUserUseCaseInput): Promise<Chat[]> {
        const chats = await this.chatRepository.getChatsByUserId(input)

        return chats;
    }
}

