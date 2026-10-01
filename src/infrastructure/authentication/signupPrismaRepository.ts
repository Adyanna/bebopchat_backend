//import { PrismaClient } from '@prisma/client';
import { AuthRepository } from '@/domain/authentication/repositories/authRepository';
import { signUpUseCaseInput } from '@/domain/authentication/use-cases/signupUseCase';
import { User } from '@/domain/authentication/User';
import { prismaClient } from '@/infrastructure/global/PrismaCLient';
import { UserFiltrQuery } from '@/domain/authentication/repositories/authRepository';

type PrismaUser = {
  id: number;
  phone: string;
  fullname: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
};

export class SignupPrismaRepository implements AuthRepository {
  private readonly prisma = prismaClient;

  async findOneUser(params: UserFiltrQuery): Promise<User | null> {
    const where: {
      phone?: string;
      id?: number;
    } = {};

    if (params.phone) {
      where.phone = params.phone;
    }

    if (params.id) {
      where.id = params.id;
    }

    const prismaUser = await this.prisma.user.findFirst({
      where,
    });

    if (!prismaUser) {
      return null;
    }

    return this.restore(prismaUser);
  }
  async create(params: signUpUseCaseInput): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        phone: params.phone,
        fullname: params.fullname,
        password: params.password,
        isActive: true
      },
    });
    return this.restore(newUser);
  }

  private restore(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      createAt: prismaUser.createdAt,
      phone: prismaUser.phone,
      fullname: prismaUser.fullname,
      password: prismaUser.password,
      isActive: prismaUser.isActive
    });
  }
}
