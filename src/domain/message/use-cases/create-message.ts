import { ChatRepository } from "@/domain/chat/repositories/ChatRepository";
import { Message } from "../Message";
import { MessageRepository } from "../repositories/MessageRepository";
import { getMessageType } from "../helpers/get-message-type";
import { EntityNotFoundError } from "@/domain/errors/EntityNotFoundError";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";

export interface CreateMessageUseCaseInput {
    chatId: number;
    senderId: number;
    multimediaUrl?: string;
    content: string;
}

export class CreateMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly chatRepository: ChatRepository
    ) { }

    async execute(input: CreateMessageUseCaseInput): Promise<Message> {
        const chatExists = await this.chatRepository.findById(input.chatId);

        if (!chatExists) {
            throw new EntityNotFoundError('Chat', input.chatId.toString());
        }
        const userIsParticipant = chatExists.participants.
            some((paricipant) => paricipant.userId === input.senderId);

        if (!userIsParticipant) {
            throw new UnauthorizedError("Your not a participant in this chat");
        }

        const type = getMessageType({ multimediaUrl: input.multimediaUrl });


        const message = await this.messageRepository.createMessage({
            chatId: input.chatId,
            senderId: input.senderId,
            content: input.content,
            multimediaUrl: input.multimediaUrl,
            type
        })

        return message;
    }
}