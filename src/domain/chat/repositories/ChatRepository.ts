import { ChatType, ParticipantRole } from "@prisma/client";
import { Chat } from "../Chat"
import { CreateChatUseCaseInput } from "../use-cases/create-chat";


export interface ChatParticipantData {
    userId: number;
    role: ParticipantRole;
}

export interface CreateChatData {
    name?: string;
    description?: string;
    type: ChatType;
    chatParticipants: ChatParticipantData[];
}



export interface ChatRepository {
    createChat: (chatData: CreateChatData) => Promise<Chat>;
    findChatByIds(creatorId: number, participantId: number): Promise<Chat | null>
}