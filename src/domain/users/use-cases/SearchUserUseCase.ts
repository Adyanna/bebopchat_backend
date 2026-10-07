import { User } from "../../authentication/User";
import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { UserRepository } from "../repositories/UserRepository";


export class SearchUserUseCase {

    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async execute(phone: string): Promise<User> {

        const user = await this.userRepository.findUserByPhone(phone);

        if (!user) {
            throw new EntityNotFoundError('User', phone.toString());
        }

        return user;
    }
}