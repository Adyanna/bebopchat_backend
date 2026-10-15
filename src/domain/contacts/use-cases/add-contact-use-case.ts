import { InvalidOperationError } from "@/domain/errors/ValidationError";
import { UserRepository } from "@/domain/users/repositories/UserRepository";
import { Contact } from "../Contact";
import { ContactRepository } from "../repositories/ContactRepository";
import { User } from "@/domain/authentication/User";

export interface AddContactUseCaseInput {
    targetId: number,
    userId: number,
}

type AddContactResult = {
    contact: Contact;
    user: User;
};

export class AddContactUseCase {

    constructor(
        private readonly contactRepository: ContactRepository,
        private readonly userRepository: UserRepository,
    ) { }

    async execute(input: AddContactUseCaseInput): Promise<AddContactResult> {

        if (input.targetId === input.userId) {
            throw new InvalidOperationError("You cannot add yourself");
        }

        const targetUser = await this.userRepository.findUserById(input.targetId);

        if (!targetUser) {
            throw new InvalidOperationError("Unable to add contact");
        }

        if (!targetUser.isActive) {
            throw new InvalidOperationError("Inactive account");
        }

        const contact = await this.contactRepository.findContactByIds(input);

        if (contact) {
            throw new InvalidOperationError('This user is already your contact');
        }

        const newContact = await this.contactRepository.addContact(input);

        return {
            contact: newContact,
            user: targetUser
        }
    }
}