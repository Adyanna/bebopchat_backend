import { User } from "@/domain/authentication/User";

export interface UserRepository {
    findUserByPhone: (phone: string) => Promise<User | null>
}