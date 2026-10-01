import { Profile } from '@/domain/profile/profile';
import { CreateProfileUseCaseInput } from '../use-cases/createProfileUseCase';
import { ProfileUpdateParams } from '../use-cases/updateProfileUseCase';
import { ProfileWithUser } from '@/domain/profile/profile';


export interface ProfileFindParams {
  userId: number;
}

export interface ProfileRepository {
  create: (params: CreateProfileUseCaseInput) => Promise<Profile>;
  findOne: (params: ProfileFindParams) => Promise<Profile | null>;
  update: (params: ProfileUpdateParams) => Promise<Profile>;
  delete: (params: ProfileFindParams) => Promise<Profile>;
  findUserWithProfile: (
    params: ProfileFindParams,
  ) => Promise<ProfileWithUser | null>;
}