import { ContactRepository } from "../repositories/ContactRepository";
import { Pagination } from "@/domain/global/Pagination";

export type GetUserContactsUseCaseInput = Pagination & {
    userId: number;
    search?: string
};

export interface UserContact {
    contactId: number;
    userContactId: number;
    phone: string,
    fullname: string;
}

export interface GetUserContactsResult {
    data: UserContact[],
    hasMore: boolean,
    nextBefore?: number,
}

export class GetUserContactsUseCase {
    constructor(
        private readonly contactRepository: ContactRepository
    ) { }

    async execute(input: GetUserContactsUseCaseInput): Promise<GetUserContactsResult> {
        return await this.contactRepository.getContactsByUserId(input);
    }
}