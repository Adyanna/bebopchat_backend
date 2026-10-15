import { User } from "../../authentication/User";
import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { UserRepository } from "../repositories/UserRepository";


export class SearchUserUseCase {

    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async execute(phone: string): Promise<{ user: User, profilePicture: string | null }> {

        const result = await this.userRepository.findUserByPhone(phone);

        if (!result) {
            throw new EntityNotFoundError('User', phone.toString());
        }

        return {
            user: result.user,
            profilePicture: result.profilePicture
        };
    }
}