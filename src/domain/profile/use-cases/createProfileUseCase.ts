import { Profile } from '../profile';
import { ProfileRepository } from '../repositories/profileRepository';
import { EntityNotFoundError } from '@/domain/errors/EntityNotFoundError';
import { BusinessConflictError } from '@/domain/errors/BusinessConflictError';
import { AuthRepository } from '@/domain/authentication/repositories/authRepository';

export interface CreateProfileUseCaseInput {
  id: number;
  photoUrl?: string;
  estadoCivil?: number;
  genero?: number;
  estadoAnimo?: number;
  descripcion?: string;
}

export class CreateProfileUseCase {
  private readonly profileRepository: ProfileRepository;
  private readonly authRepository: AuthRepository;

  constructor(profileRepository: ProfileRepository, authRepository: AuthRepository,) {
    this.profileRepository = profileRepository;
    this.authRepository = authRepository;
  }

  async executeCreateProfile(
    props: CreateProfileUseCaseInput,
  ): Promise<Profile> {
    console.log("PROPIEDADES:", props)
    const user = await this.authRepository.findOneUser({
      id: props.id,
    });

    if (!user) {
      throw new EntityNotFoundError('user', props.id.toString());
    }

    const existingProfile = await this.profileRepository.findOne({
      userId: props.id,
    });

    if (existingProfile) {
      throw new BusinessConflictError('Profile already exists');
    }

    const profile = await this.profileRepository.create(props);

    return profile;
  }
}