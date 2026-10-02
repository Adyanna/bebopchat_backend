import { ChatType, ParticipantRole } from "@prisma/client";
import { Chat } from "../Chat";
import { ChatRepository } from "../repositories/ChatRepository";
import { InvalidOperationError, ValidationError } from "@/domain/errors/ValidationError";
import { AuthRepository } from "@/domain/authentication/repositories/authRepository";


export interface CreateChatUseCaseInput {
    creatorId: number;
    name?: string;
    description?: string;
    participantIds: number[]
}

export class CreateChatUseCase {

    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly authRepository: AuthRepository
    ) { }

    async execute(input: CreateChatUseCaseInput): Promise<{ chat: Chat, isNew: boolean }> {

        if (input.participantIds.length < 1) {
            throw new InvalidOperationError("there must be at least one participant in the chat");
        }
        if (input.participantIds.includes(input.creatorId)) {
            throw new InvalidOperationError("you cannot create a chat with yourself");
        }
        const repeatedMembers = new Set(input.participantIds).size !== input.participantIds.length;
        if (repeatedMembers) throw new InvalidOperationError("you cannot add repeated participants");

        const type = input.participantIds.length === 1 ? ChatType.INDIVIDUAL : ChatType.GROUP;

        if (type === ChatType.GROUP && !input.name?.trim()) {
            throw new ValidationError("group chat name is required");
        }
        const existingChat = type === ChatType.INDIVIDUAL && await this.chatRepository.findChatByIds(input.creatorId, input.participantIds[0]);

        if (existingChat) return { chat: existingChat, isNew: false };

        const users = await this.authRepository.findUsers({ usersIds: input.participantIds });

        if (users.length !== input.participantIds.length) {
            throw new InvalidOperationError("One or more participants do not exists");
        }

        const participants = [
            { userId: input.creatorId, role: ParticipantRole.ADMIN },
            ...input.participantIds.map((userId) => ({
                userId,
                role: ParticipantRole.MEMBER
            }))
        ];
        const newChat = await this.chatRepository.createChat({
            name: input.name,
            description: input.description,
            type,
            chatParticipants: participants
        });


        return { chat: newChat, isNew: true };
    }
}