import { User } from "@/domain/authentication/User";


export interface UserRepository {
    findUserByPhone: (phone: string) => Promise<User | null>
    findUserById: (id: number) => Promise<User | null>
}