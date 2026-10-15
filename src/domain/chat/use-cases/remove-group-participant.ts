import { ChatType, ParticipantRole } from "@prisma/client";
import { ChatRepository } from "@/domain/chat/repositories/ChatRepository";
import { EntityNotFoundError } from "@/domain/errors/EntityNotFoundError";
import { ForbiddenError } from "@/domain/errors/ForbiddenError";
import { InvalidOperationError } from "@/domain/errors/ValidationError";

export interface RemoveGroupParticipantUseCaseInput {
    chatId: number;
    userId: number;
    participantId: number;
}

export class RemoveGroupParticipantUseCase {
    constructor(
        private readonly chatRepository: ChatRepository
    ) { }

    async execute(
        input: RemoveGroupParticipantUseCaseInput
    ): Promise<void> {
        const { chatId, userId, participantId } = input;

        const chat = await this.chatRepository.findById(chatId);

        if (!chat) {
            throw new EntityNotFoundError('Chat', chatId.toString());
        }

        if (chat.type !== ChatType.GROUP) {
            throw new InvalidOperationError(
                "participants can only be removed from group chats"
            );
        }

        const requester = chat.participants.find(
            participant => participant.userId === userId
        );

        if (requester?.role !== ParticipantRole.ADMIN) {
            throw new ForbiddenError(
                "only group admins can remove participants"
            );
        }

        if (participantId === userId) {
            throw new InvalidOperationError(
                "admins cannot remove themselves with this operation"
            );
        }

        const participantExists = chat.participants.some(
            participant => participant.userId === participantId
        );

        if (!participantExists) {
            throw new EntityNotFoundError("Participant", participantId.toString());
        }

        await this.chatRepository.removeParticipant(chatId, participantId);
    }
}
