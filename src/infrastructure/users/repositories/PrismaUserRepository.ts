import { User } from "@/domain/authentication/User";
import { UserRepository } from "@/domain/users/repositories/UserRepository";
import { prismaClient } from "@/infrastructure/global/PrismaCLient";
import { User as PrismaUser } from "@prisma/client";


export class PrismaUserRepository implements UserRepository {
    private readonly prisma = prismaClient;

    async findUserByPhone(phone: string): Promise<{ user: User, profilePicture: string | null } | null> {

        const user = await this.prisma.user.findUnique({
            where: {
                phone: phone,
            },
            include: {
                perfil: true
            }
        });

        if (!user) return null

        return {
            user: this.restore(user),
            profilePicture: user.perfil?.photoUrl ?? null
        }

    }

    async findUserById(id: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            }
        });

        if (!user) return null;

        return this.restore(user);
    }

    async findManyByIds(userIds: number[]): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: {
                id: {
                    in: userIds,
                },
            },
        })

        return users.map(user => this.restore(user));
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