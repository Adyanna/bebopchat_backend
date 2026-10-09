import { AddContactUseCaseInput } from "../use-cases/add-contact-use-case";
import { Contact } from "../Contact";
import { GetUserContactsResult, GetUserContactsUseCaseInput, UserContact } from "../use-cases/get-user-contacts";
import { SearchContactUseCaseInput } from "../use-cases/search-contact-use-case";


export interface ContactRepository {
    findContactByIds: (input: AddContactUseCaseInput) => Promise<Contact | null>
    addContact: (input: AddContactUseCaseInput) => Promise<Contact>
    getContactsByUserId: (input: GetUserContactsUseCaseInput) => Promise<GetUserContactsResult>
    getContacts: (searchInput: SearchContactUseCaseInput) => Promise<GetUserContactsResult>
}