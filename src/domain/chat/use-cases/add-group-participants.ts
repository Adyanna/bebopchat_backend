import { ChatRepository } from "@/domain/chat/repositories/ChatRepository";
import { EntityNotFoundError } from "@/domain/errors/EntityNotFoundError";
import { ForbiddenError } from "@/domain/errors/ForbiddenError";
import { InvalidOperationError } from "@/domain/errors/ValidationError";
import { UserRepository } from "@/domain/users/repositories/UserRepository";
import { ChatType, ParticipantRole } from "@prisma/client";
import { Chat } from "../Chat";

export interface AddGroupParticipantsUseCaseInput {
    chatId: number;
    userId: number;
    userContactIds: number[];
}

export class AddGroupParticipantsUseCase {
    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly userRepository: UserRepository,
    ) { }

    async execute(
        input: AddGroupParticipantsUseCaseInput
    ): Promise<Chat> {
        const { chatId, userId, userContactIds } = input;

        if (userContactIds.length === 0) {
            throw new InvalidOperationError(
                "At least one participant must be selected"
            );
        }

        const chat = await this.chatRepository.findById(chatId);

        if (!chat) {
            throw new EntityNotFoundError('Chat', chatId.toString());
        }

        if (chat.type !== ChatType.GROUP) {
            throw new InvalidOperationError(
                "participants can only be added to group chats"
            );
        }

        const requester = chat.participants.find(
            participant => participant.userId === userId
        );

        if (requester?.role !== ParticipantRole.ADMIN) {
            throw new ForbiddenError(
                "only group admins can add participants"
            );
        }

        if (new Set(userContactIds).size !== userContactIds.length) {
            throw new InvalidOperationError("you cannot add repeated participants");
        }

        if (userContactIds.some(userContactId => userContactId === userId)) {
            throw new InvalidOperationError(
                "admins cannot add themselves"
            );
        }


        const existentParticipants = chat.participants.filter(
            participant => userContactIds.includes(participant.userId)
        );

        if (existentParticipants.length > 0) {
            throw new InvalidOperationError(
                `These users are already participants in this chat: ${existentParticipants.map(p => p.userId).join(", ")}`
            )
        }

        const users = await this.userRepository.findManyByIds(userContactIds);

        const foundIds = new Set(users.map(user => user.id));

        const missingIds = userContactIds.filter(
            id => !foundIds.has(id)
        );

        if (missingIds.length > 0) {
            throw new EntityNotFoundError('Users', missingIds.join(", "));
        }

        return await this.chatRepository.addParticipants(chatId, userContactIds);
    }
}
