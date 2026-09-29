import { MessageData, MessageRepository } from "@/domain/message/repositories/MessageRepository";
import { prismaClient } from "@/infrastructure/global/PrismaCLient";
import { Message as PrismaMessage } from "@prisma/client";
import { Message } from "@/domain/message/Message";


export class PrismaMessageRepository implements MessageRepository {
    private readonly prisma = prismaClient;

    async createMessage(params: MessageData): Promise<Message> {
        const newMessage = await this.prisma.message.create({
            data: {
                chatId: params.chatId,
                content: params.content,
                type: params.type,
                multimediaUrl: params.multimediaUrl,
                senderId: params.senderId
            }
        });

        return this.restore(newMessage);
    }

    private restore(prismaMessage: PrismaMessage): Message {
        return new Message({
            id: prismaMessage.id,
            content: prismaMessage.content,
            multimediaUrl: prismaMessage.multimediaUrl ?? undefined,
            type: prismaMessage.type,
            chatId: prismaMessage.chatId,
            senderId: prismaMessage.senderId,
            createAt: prismaMessage.createdAt
        });
    }
}