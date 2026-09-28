import { ChatType, ParticipantRole } from "@prisma/client";
import { Chat } from "../Chat"
import { CreateChatUseCaseInput } from "../use-cases/create-chat";


export interface CreateChatData {
    name?: string;
    description?: string;
    type: ChatType;
}
export interface ChatParticipantData {
    userId: number;
    role: ParticipantRole;
}

export interface ChatRepository {
    createChat: (chatData: CreateChatData, participants: ChatParticipantData[]) => Promise<Chat>;
    findChatByIds(creatorId: number, participantId: number): Promise<Chat | null>
}