import { MessageType } from "@prisma/client";
import { Message } from "../Message";
import { CreateMessageUseCaseInput } from "../use-cases/create-message";
import { EditMessageUseCaseInput } from "../use-cases/edit-message";


export type MessageData = CreateMessageUseCaseInput & {
    type: MessageType;
}

export interface MessageRepository {
    createMessage: (messageData: MessageData) => Promise<Message>;
    editMessage: (messageData: EditMessageUseCaseInput) => Promise<Message>
    findById: (messageId: number) => Promise<Message | null>
    deleteMessage: (id: number) => Promise<void>;
}