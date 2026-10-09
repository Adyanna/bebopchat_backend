import { ContactRepository } from "../repositories/ContactRepository";
import { EntityNotFoundError } from "@/domain/errors/EntityNotFoundError";

export interface DeleteContactUseCaseInput {
    userContactId: number;
    userId: number;
}

export class DeleteContactUseCase {
    constructor(
        private readonly contactRepository: ContactRepository
    ) { }

    async execute(input: DeleteContactUseCaseInput): Promise<void> {
        const contact = await this.contactRepository.findContactByIds({
            targetId: input.userContactId,
            userId: input.userId
        });
        if (!contact) {
            throw new EntityNotFoundError('Contact', input.userContactId.toString());
        }

        await this.contactRepository.delete(input);
    }
}