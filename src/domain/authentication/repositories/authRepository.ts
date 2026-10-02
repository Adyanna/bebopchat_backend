import { signUpUseCaseInput } from '@/domain/authentication/use-cases/signupUseCase';
import { User } from '@/domain/authentication/User';

export interface UserFiltrQuery {
  phone?: string;
  id?: number;
}

export interface UsersIdInput {
  usersIds: number[]
}

export interface AuthRepository {
  findOneUser: (params: UserFiltrQuery) => Promise<User | null>;
  create: (params: signUpUseCaseInput) => Promise<User>;
  findUsers: (usersIds: UsersIdInput) => Promise<User[]>
}
