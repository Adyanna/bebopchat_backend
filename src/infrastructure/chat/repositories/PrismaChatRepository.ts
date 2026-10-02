import { Chat } from "@/domain/chat/Chat";
import { Prisma } from "@prisma/client";
import { ChatType } from "@prisma/client";
import { ChatRepository, CreateChatData } from "@/domain/chat/repositories/ChatRepository";
import { prismaClient } from "@/infrastructure/global/prismaCLient";
import { GetChatsByUserUseCaseInput } from "@/domain/chat/use-cases/get-chats-by-user";
import { Message as PrismaMessage } from "@prisma/client"
import { LastMessage } from "@/domain/chat/Chat";


type PrismaChat = Prisma.ChatsGetPayload<{
    include: {
        chatParticipants: {
            include: {
                user: true;
            };
        };
    };
}>;

type PrismaList = Prisma.ChatsGetPayload<{
    include: {
        chatParticipants: {
            include: {
                user: true;
            };
        };
        mensajes: {
            orderBy: {
                createdAt: "desc";
            };
            take: 1;
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
        const chat = await this.prisma.chats.findUnique({
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

    async getChatsByUserId(params: GetChatsByUserUseCaseInput):
        Promise<Chat[]> {
        const { limit, userId } = params;
        const chatsDb = await this.prisma.chats.findMany({
            where: {
                chatParticipants: {
                    some: {
                        userId,
                    }
                }
            },
            include: {
                chatParticipants: {
                    include: {
                        user: true
                    }
                },
                mensajes: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: limit,
        });

        const chats = chatsDb.map(chatDb => this.restoreChatList(chatDb, userId));

        return chats;
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

    private restoreChatList(prismaList: PrismaList, userId: number): Chat {
        const otherParticipant = prismaList.chatParticipants.find(
            participant => participant.userId !== userId
        );

        return new Chat({
            id: prismaList.id,
            name: prismaList.type === "INDIVIDUAL"
                ? otherParticipant?.user.fullname
                : prismaList.name ?? undefined,
            description: prismaList.description ?? undefined,
            type: prismaList.type,
            createAt: prismaList.createdAt,
            participants: prismaList.chatParticipants.map((participant) => ({
                userId: participant.userId,
                fullname: participant.user.fullname,
                role: participant.role,
            })),
            lastMessage: prismaList.mensajes[0]
                ? this.restoreLastMessage(prismaList.mensajes[0])
                : undefined,
        });
    }

    private restoreLastMessage(prismaMessage: PrismaMessage): LastMessage {
        return {
            id: prismaMessage.id,
            content: prismaMessage.content,
            multimediaUrl: prismaMessage.multimediaUrl ?? undefined,
            type: prismaMessage.type,
            senderId: prismaMessage.senderId,
            chatId: prismaMessage.chatId,
            createdAt: prismaMessage.createdAt,
        };
    }
}