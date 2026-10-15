import { User } from "@/domain/authentication/User";


export interface UserRepository {
    findUserByPhone: (phone: string) => Promise<{ user: User, profilePicture: string | null } | null>
    findUserById: (id: number) => Promise<User | null>
}