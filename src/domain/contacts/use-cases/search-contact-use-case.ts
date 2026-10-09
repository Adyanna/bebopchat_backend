import { Pagination } from "@/domain/global/Pagination";
import { ContactRepository } from "../repositories/ContactRepository";
import { GetUserContactsResult } from "./get-user-contacts";


export interface SearchParams {
    userId: number;
    search: string;
}

export type SearchContactUseCaseInput = Pagination & SearchParams;

export class SearchContactUseCase {
    constructor(
        private readonly contactRepository: ContactRepository
    ) { }

    async execute(searchInput: SearchContactUseCaseInput):
        Promise<GetUserContactsResult> {

        return await this.contactRepository.getContacts(searchInput);

    }
}