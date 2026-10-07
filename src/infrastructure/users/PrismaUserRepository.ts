import { User } from "@/domain/authentication/User";
import { UserRepository } from "@/domain/users/repositories/UserRepository";
import { prismaClient } from "@/infrastructure/global/prismaCLient";
import { User as PrismaUser } from "@prisma/client";


export class PrismaUserRepository implements UserRepository {
    private readonly prisma = prismaClient;

    async findUserByPhone(phone: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                phone: phone,
            }
        });

        if (!user) return null

        return this.restore(user)

    }

    private restore(prismaUser: PrismaUser): User {
        return new User({
            id: prismaUser.id,
            createAt: prismaUser.createdAt,
            phone: prismaUser.phone,
            fullname: prismaUser.fullname,
            password: prismaUser.password,
            isActive: prismaUser.isActive,
        })
    }
}