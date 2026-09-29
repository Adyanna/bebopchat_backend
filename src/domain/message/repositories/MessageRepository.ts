import { MessageType } from "@prisma/client";
import { Message } from "../Message";
import { CreateMessageUseCaseInput } from "../use-cases/create-message";


export type MessageData = CreateMessageUseCaseInput & {
    type: MessageType;
}

export interface MessageRepository {
    createMessage: (messageData: MessageData) => Promise<Message>
}