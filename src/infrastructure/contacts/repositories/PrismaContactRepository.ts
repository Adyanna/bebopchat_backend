import { AddContactUseCaseInput } from "@/domain/contacts/use-cases/add-contact-use-case";
import { prismaClient } from "@/infrastructure/global/prismaCLient";
import { Contact } from "@/domain/contacts/Contact";
import { Contacts as PrismaContact } from "@prisma/client";
import { GetUserContactsResult, GetUserContactsUseCaseInput, UserContact } from "@/domain/contacts/use-cases/get-user-contacts";
import { SearchContactUseCaseInput } from "@/domain/contacts/use-cases/search-contact-use-case";
import { DeleteContactUseCaseInput } from "@/domain/contacts/use-cases/delete-contact-use-case";

export class PrismaContactRepository {
    private readonly prisma = prismaClient;

    async findContactByIds(params: AddContactUseCaseInput): Promise<Contact | null> {
        const contact = await this.prisma.contacts.findUnique({
            where: {
                userId_userContactId: {
                    userId: params.userId,
                    userContactId: params.targetId,
                }
            }
        });

        if (!contact) return null

        return this.restore(contact);

    }

    async addContact(params: AddContactUseCaseInput): Promise<Contact> {
        const contact = await this.prisma.contacts.create({
            data: {
                userId: params.userId,
                userContactId: params.targetId,
            }
        })

        return this.restore(contact);
    }

    async getContactsByUserId(params: GetUserContactsUseCaseInput):
        Promise<GetUserContactsResult> {
        const { limit, userId, before } = params;
        const contactsDb = await this.prisma.contacts.findMany({
            where: {
                userId,
                ...(before && {
                    id: {
                        lt: before
                    }
                })
            },
            include: {
                userContact: true,
            },
            orderBy: {
                id: 'desc'
            },
            take: limit + 1,
        })

        const userContacts = contactsDb.map(contactDb => ({
            contactId: contactDb.id,
            userContactId: contactDb.userContactId,
            phone: contactDb.userContact.phone,
            fullname: contactDb.userContact.fullname
        }));

        const hasMore = userContacts.length === limit + 1;
        const data = userContacts.slice(0, limit);
        const nextBefore = hasMore ? data.at(-1)?.contactId : undefined;

        return {
            data,
            hasMore,
            nextBefore
        };
    }

    async getContacts(params: SearchContactUseCaseInput):
        Promise<GetUserContactsResult> {
        const { limit, userId, before } = params;


        const contactsDb = await this.prisma.contacts.findMany({
            where: {
                userId,

                ...(before !== undefined && {
                    id: {
                        lt: before
                    }
                }),

                userContact: {
                    is: {
                        OR: [
                            {
                                phone: {
                                    contains: params.search
                                }
                            },
                            {
                                fullname: {
                                    contains: params.search,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    }
                }
            },

            include: {
                userContact: true
            },

            orderBy: {
                id: 'desc'
            },

            take: limit + 1,
        });

        const userContacts = contactsDb.map(contactDb => ({
            contactId: contactDb.id,
            userContactId: contactDb.userContactId,
            phone: contactDb.userContact.phone,
            fullname: contactDb.userContact.fullname
        }));

        const hasMore = userContacts.length === limit + 1;
        const data = userContacts.slice(0, limit);
        const nextBefore = hasMore ? data.at(-1)?.contactId : undefined;

        return {
            data,
            hasMore,
            nextBefore
        };
    }

    async delete(params: DeleteContactUseCaseInput): Promise<void> {
        await this.prisma.contacts.delete({
            where: {
                userId_userContactId: {
                    userId: params.userId,
                    userContactId: params.userContactId
                }
            }
        });
    }

    private restore(prismaContact: PrismaContact): Contact {
        return new Contact({
            id: prismaContact.id,
            createAt: prismaContact.createdAt,
            userId: prismaContact.userId,
            userContactId: prismaContact.userContactId
        });
    }
}