import { EntityNotFoundError } from '@/domain/errors/EntityNotFoundError';
import { Profile } from '../profile';
import { ProfileRepository } from '../repositories/profileRepository';

export interface ProfileUpdateParams {
  id: number;
  photoUrl?: string;
  estadoCivil?: number;
  genero?: number;
  estadoAnimo?: number;
  descripcion?: string;
}

export class UpdateProfileUseCase {
  private readonly profileRepository: ProfileRepository;

  constructor(profileRepository: ProfileRepository) {
    this.profileRepository = profileRepository;
  }

  async executeUpdateProfile(
    props: ProfileUpdateParams,
  ): Promise<Profile> {
    const existingProfile = await this.profileRepository.findOne({
      userId: props.id,
    });

    if (!existingProfile) {
      throw new EntityNotFoundError('profile', props.id.toString());
    }

    const profile = await this.profileRepository.update(props);

    return profile;
  }
}