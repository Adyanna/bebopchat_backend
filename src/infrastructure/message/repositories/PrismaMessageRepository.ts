import { MessageData, MessageRepository } from "@/domain/message/repositories/MessageRepository";
import { prismaClient } from "@/infrastructure/global/PrismaCLient";
import { Message as PrismaMessage } from "@prisma/client";
import { Message } from "@/domain/message/Message";
import { EditMessageUseCaseInput } from "@/domain/message/use-cases/edit-message";


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

    async editMessage(params: EditMessageUseCaseInput): Promise<Message> {
        const editedMessage = await this.prisma.message.update({
            where: {
                id: params.messageId,
            },
            data: {
                content: params.newContent
            }
        });

        return this.restore(editedMessage);
    }

    async deleteMessage(id: number): Promise<void> {
        await this.prisma.message.delete({
            where: {
                id,
            }
        })
    }

    async findById(messageid: number): Promise<Message | null> {
        const message = await this.prisma.message.findUnique({
            where: {
                id: messageid
            }
        });

        if (!message) {
            return null;
        }

        return this.restore(message);
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