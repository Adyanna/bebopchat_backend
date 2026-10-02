import { MessageData, MessageRepository } from "@/domain/message/repositories/MessageRepository";
import { prismaClient } from "@/infrastructure/global/prismaCLient";
import { Message as PrismaMessage } from "@prisma/client";
import { Message } from "@/domain/message/Message";
import { EditMessageUseCaseInput } from "@/domain/message/use-cases/edit-message";
import { GetMessagesByChatInput } from "@/domain/message/use-cases/get-messages";


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

        await this.prisma.chats.update({
            where: {
                id: params.chatId,
            },
            data: {
                updatedAt: new Date(),
            },
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

    async getMessagesByChatId(params: GetMessagesByChatInput):
        Promise<Message[]> {
        const { before, limit, chatId } = params;
        const messagesDb = await this.prisma.message.findMany({
            where: {
                chatId,
                ...(before && {
                    id: {
                        lt: before
                    }
                })
            },
            orderBy: {
                id: 'desc'
            },
            take: limit
        });


        const messages = messagesDb.map(messagedb => this.restore(messagedb)).reverse();

        return messages
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