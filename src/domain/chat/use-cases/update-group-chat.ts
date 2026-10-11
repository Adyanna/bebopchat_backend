
import { ChatType, ParticipantRole } from "@prisma/client";
import { Chat } from "../Chat";
import { ChatRepository } from "../repositories/ChatRepository";
import { EntityNotFoundError } from "@/domain/errors/EntityNotFoundError";
import { ForbiddenError } from "@/domain/errors/ForbiddenError";
import { InvalidOperationError } from "@/domain/errors/ValidationError";
import { ValidationError } from "@/domain/errors/ValidationError";

export interface UpdateGroupChatUseCaseInput {
    chatId: number;
    userId: number;
    name?: string;
    description?: string;
}

export class UpdateGroupChatUseCase {
    constructor(
        private readonly chatRepository: ChatRepository
    ) { }

    async execute(input: UpdateGroupChatUseCaseInput): Promise<Chat> {
        const { chatId, userId, name, description } = input;

        if (name === undefined && description === undefined) {
            throw new InvalidOperationError(
                "at least one field must be provided"
            );
        }

        if (name !== undefined && !name.trim()) {
            throw new ValidationError("group chat name cannot be empty");
        }

        const chat = await this.chatRepository.findById(chatId);

        if (!chat) {
            throw new EntityNotFoundError('Chat', chatId.toString());
        }

        if (chat.type !== ChatType.GROUP) {
            throw new InvalidOperationError(
                "only group chats can be updated"
            );
        }

        const requester = chat.participants.find(
            participant => participant.userId === userId
        );

        if (requester?.role !== ParticipantRole.ADMIN) {
            throw new ForbiddenError(
                "only group admins can update the group"
            );
        }

        return this.chatRepository.updateGroupChat({
            chatId,
            name,
            description,
        });
    }
}
