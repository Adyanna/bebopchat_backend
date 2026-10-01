import { Perfil as PrismaProfile } from '@prisma/client';
import { ProfileRepository } from '@/domain/profile/repositories/profileRepository';
import { CreateProfileUseCaseInput } from '@/domain/profile/use-cases/createProfileUseCase';
import { ProfileUpdateParams } from '@/domain/profile/use-cases/updateProfileUseCase';
import {
  ProfileFindParams,
} from '@/domain/profile/repositories/profileRepository';
import { Profile } from '@/domain/profile/profile';
import { prismaClient } from '../global/PrismaCLient';

export class ProfilePrismaRepository implements ProfileRepository {
  private readonly prisma = prismaClient;

  async create(params: CreateProfileUseCaseInput): Promise<Profile> {
    const newProfile = await this.prisma.perfil.create({
      data: {
        id: params.id,
        photoUrl: params.photoUrl,
        estadoCivil: params.estadoCivil,
        genero: params.genero,
        estadoAnimo: params.estadoAnimo,
        descripcion: params.descripcion,
      },
    });

    return this.restore(newProfile);
  }

  private restore(prismaProfile: PrismaProfile): Profile {
    return new Profile({
      id: prismaProfile.id,
      userId: prismaProfile.id,
      photoUrl: prismaProfile.photoUrl,
      estadoCivil: prismaProfile.estadoCivil,
      genero: prismaProfile.genero,
      estadoAnimo: prismaProfile.estadoAnimo,
      Descripcion: prismaProfile.descripcion,
      createAt: prismaProfile.createdAt,
    });
  }

  async findOne(params: ProfileFindParams): Promise<Profile | null> {

    const profile = await this.prisma.perfil.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!profile) {
      return null;
    }

    return this.restore(profile);
  }

  async update(params: ProfileUpdateParams): Promise<Profile> {
    const newProfile = await this.prisma.perfil.update({
      where: {
        id: params.id,
      },
      data: {
        photoUrl: params.photoUrl,
        estadoCivil: params.estadoCivil,
        genero: params.genero,
        estadoAnimo: params.estadoAnimo,
        descripcion: params.descripcion,
      },
    });

    return this.restore(newProfile);
  }

  async delete(params: ProfileFindParams): Promise<Profile> {
    const profile = await this.prisma.perfil.delete({
      where: {
        id: params.userId,
      },
    });

    return this.restore(profile);
  }

  async findUserWithProfile(params: ProfileFindParams) {
    console.log("INFRAESTRUCTURA:", params)
    const user = await this.prisma.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        id: true,
        phone: true,
        fullname: true,
        isActive: true,
        createdAt: true,
        perfil: {
          select: {
            id: true,
            photoUrl: true,
            estadoCivil: true,
            genero: true,
            estadoAnimo: true,
            descripcion: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}