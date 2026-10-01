import { ProfileWithUser } from '../profile';
import { ProfileRepository } from '../repositories/profileRepository';
import { EntityNotFoundError } from '@/domain/errors/EntityNotFoundError';

// export interface ProfileWithUser {
//   id: number;
//   phone: string;
//   fullname: string;
//   isActive: boolean;
//   createdAt: Date;
//   perfil: Profile | null;
// }


export class ViewProfileUseCase {
  private readonly profileRepository: ProfileRepository;

  constructor(profileRepository: ProfileRepository) {
    this.profileRepository = profileRepository;
  }

  async executeViewProfile(userId: number): Promise<ProfileWithUser> {

        console.log("CASO DE USO: ",userId)
    const user = await this.profileRepository.findUserWithProfile({
      userId,
    });

    if (!user) {
      throw new EntityNotFoundError('user', userId.toString());
    }

    return user;
  }
}