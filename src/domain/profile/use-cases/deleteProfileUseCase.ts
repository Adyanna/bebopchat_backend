import { Profile } from '../profile';
import {
  ProfileFindParams,
  ProfileRepository,
} from '../repositories/profileRepository';
import { EntityNotFoundError } from '@/domain/errors/EntityNotFoundError';

export class DeleteProfileUseCase {
  private readonly profileRepository: ProfileRepository;

  constructor(profileRepository: ProfileRepository) {
    this.profileRepository = profileRepository;
  }

  async executeDeleteProfile(
    props: ProfileFindParams,
  ): Promise<Profile> {
    const existingProfile = await this.profileRepository.findOne({
      userId: props.userId,
    });

    if (!existingProfile) {
      throw new EntityNotFoundError(
        'profile',
        props.userId.toString(),
      );
    }

    const profile = await this.profileRepository.delete(props);

    return profile;
  }
}