import { AddContactUseCaseInput } from "../use-cases/add-contact-use-case";
import { Contact } from "../Contact";


export interface ContactRepository {
    findContactByIds: (input: AddContactUseCaseInput) => Promise<Contact | null>
    addContact: (input: AddContactUseCaseInput) => Promise<Contact>
}