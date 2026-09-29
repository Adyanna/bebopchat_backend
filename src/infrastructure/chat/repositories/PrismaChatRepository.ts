import { Chat } from "@/domain/chat/Chat";
import { Prisma } from "@prisma/client";
import { ChatType } from "@prisma/client";
import { ChatRepository, CreateChatData } from "@/domain/chat/repositories/ChatRepository";
import { prismaClient } from "@/infrastructure/global/PrismaCLient";

type PrismaChat = Prisma.ChatsGetPayload<{
    include: {
        chatParticipants: {
            include: {
                user: true;
            };
        };
    };
}>;


export class PrismaChatRepository implements ChatRepository {
    private readonly prisma = prismaClient;

    async createChat(params: CreateChatData): Promise<Chat> {
        const newChat = await this.prisma.chats.create({
            data: {
                name: params.name,
                description: params.description,
                type: params.type,
                chatParticipants: {
                    create: params.chatParticipants.map((participant) => ({
                        userId: participant.userId,
                        role: participant.role
                    }))
                }

            },
            include: {
                chatParticipants: {
                    include: {
                        user: true,
                    }
                }
            }
        });

        return this.restore(newChat);


    }

    async findChatByIds(creatorId: number, participantId: number): Promise<Chat | null> {

        const chat = await this.prisma.chats.findFirst({
            where: {
                type: ChatType.INDIVIDUAL,
                chatParticipants: {
                    some: {
                        userId: creatorId
                    }
                },
                AND: {
                    chatParticipants: {
                        some: {
                            userId: participantId
                        }
                    }
                }
            },
            include: {
                chatParticipants: {
                    include: {
                        user: true,
                    }
                }
            }

        });

        if (!chat) {
            return null;
        }

        return this.restore(chat);
    }

    async findById(chatId: number): Promise<Chat | null> {
        const chat = await this.prisma.chats.findFirst({
            where: {
                id: chatId,
            },
            include: {
                chatParticipants: {
                    include: {
                        user: true,
                    }
                }
            }
        });

        if (!chat) {
            return null;
        }

        return this.restore(chat);
    }

    private restore(prismaChat: PrismaChat): Chat {
        return new Chat({
            id: prismaChat.id,
            name: prismaChat.name ?? undefined,
            description: prismaChat.description ?? undefined,
            type: prismaChat.type,
            createAt: prismaChat.createdAt,
            participants: prismaChat.chatParticipants.map((participant) => ({
                userId: participant.userId,
                fullname: participant.user.fullname,
                role: participant.role
            }))
        })
    }
}