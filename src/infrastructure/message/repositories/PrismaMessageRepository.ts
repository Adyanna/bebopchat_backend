import { MessageData, MessageRepository } from "@/domain/message/repositories/MessageRepository";
import { prismaClient } from "@/infrastructure/global/PrismaCLient";
import { ChatType, Message as PrismaMessage,StatusType } from "@prisma/client";
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


    async updateMessageStatus(
        messageId: number,
        status: StatusType,
        userId: number
    ): Promise<{message: Message;chatType: string;}> {

        console.log("BUSCAMOS LOS MENSAJES: ")
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
            include: {
                chat: {
                    include: {
                        chatParticipants: true,
                    },
                },
            },
        });
        
        if (!message) {
            throw new Error("Mensaje no encontrado");
        }
        console.log("MENSAJE ENCONTRADO: ",message)
        console.log("VERIFICAMOS SI ES INDIVIDUAL O GRUPAL")
        console.log("CHAT TYPE:  ",message.chat.type)

        // Chat individual: actualizar el estado directamente
        if (message.chat.type === "INDIVIDUAL") {
            console.log("ES INDIVIDUAL SE ACTUALIZA ESTADO Y RECOTA EL VALOR: ",status)
            const updatedMessage = await this.prisma.message.update({
                where: { id: messageId },
                data: { status },
            });
            return {
                message: this.restore(updatedMessage),
                chatType: message.chat.type,
            };
        }

        // Chat grupal: registrar quién vio el mensaje
        console.log("ES GRUPAL, OBTENEMOS EL CAMPOS VIEW: ",message.viewedBy)

        const viewedByIds = message.viewedBy
            ? message.viewedBy.split(",").filter(Boolean)
            : [];

        if (!viewedByIds.includes(String(userId))) {
            viewedByIds.push(String(userId));
        }
        console.log("ANIADIMOS AL USUARIO ACTUAL EN CASO QUE NO ESTE: ", viewedByIds,"USER ID", userId)

        const recipients = message.chat.chatParticipants.filter(
            (participant) => participant.userId !== message.senderId
        );

        console.log("OBTENEMOS LOS PARTICIPANTES DEL CHAT SIN EL EMISOR: ", recipients)


        const allRecipientsViewed = recipients.every((participant) =>
            viewedByIds.includes(String(participant.userId))
        );

        console.log("VERIFICAMOS SI TODOS LO VIERON: ", allRecipientsViewed)


        const updatedMessage = await this.prisma.message.update({
            where: { id: messageId },
            data: {
                viewedBy: viewedByIds.join(","),
                status: allRecipientsViewed ? "VIEW" : "SEND",
            },
        });

        return {
            message: this.restore(updatedMessage),
            chatType: message.chat.type,
        };
    }

    async updatePendingMessages(userId: number): Promise<Message[]> {

        // encontrando todos los mesajes pendientes
        const pendingMessages = await prismaClient.message.findMany({
            where: {
                status: "SEND",
                senderId: { not: userId },
                chat: {
                    type: "INDIVIDUAL",
                    chatParticipants: {
                        some: { userId },
                    },
                },
            },
        });

        const updatedMessages: Message[] = [];

        for (const message of pendingMessages) {
            const updated = await prismaClient.message.updateMany({
                where: {
                    id: message.id,
                    status: "SEND",
                },
                data: {
                    status: "RECIBE",
                },
            });

            if (updated.count === 0) continue;

            const updatedMessage = await this.findById(message.id);

            if (updatedMessage) {
                updatedMessages.push(updatedMessage);
            }
        }

        return updatedMessages;
    }

    private restore(prismaMessage: PrismaMessage): Message {
        return new Message({
            id: prismaMessage.id,
            content: prismaMessage.content ?? undefined,
            multimediaUrl: prismaMessage.multimediaUrl ?? undefined,
            type: prismaMessage.type,
            status: prismaMessage.status,
            chatId: prismaMessage.chatId,
            senderId: prismaMessage.senderId,
            createAt: prismaMessage.createdAt,
            updatedAt: prismaMessage.updatedAt
        });
    }
}