import { AddContactUseCaseInput } from "@/domain/contacts/use-cases/add-contact-use-case";
import { prismaClient } from "@/infrastructure/global/prismaCLient";
import { Contact } from "@/domain/contacts/Contact";
import { Contacts as PrismaContact } from "@prisma/client";

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

    private restore(prismaContact: PrismaContact): Contact {
        return new Contact({
            id: prismaContact.id,
            createAt: prismaContact.createdAt,
            userId: prismaContact.userId,
            userContactId: prismaContact.userContactId
        });
    }
}