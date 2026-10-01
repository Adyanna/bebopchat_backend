import { BusinessConflictError } from '@/domain/errors/BusinessConflictError';
import { SecurityServices } from '@/domain/global/SecurityService';
import { AuthRepository } from '../repositories/authRepository';

import { User } from '../User';

export interface signUpUseCaseInput {
  phone: string;
  password: string;
  fullname: string;
}

export class SignUpUseCase {
  private readonly authRepository: AuthRepository;
  private readonly segurityService: SecurityServices;

  constructor(authRepository: AuthRepository, segurityService: SecurityServices) {
    this.authRepository = authRepository;
    this.segurityService = segurityService;
  }

  async executeUser(props: signUpUseCaseInput): Promise<User> {
     const user = await this.authRepository.findOneUser({phone: props.phone,});
  
    if (user) {
      //throw new Error('USER_ALREADY_EXISTS');
      throw new BusinessConflictError('An user with this phone already exists');
    }
    const HashPassword = await this.segurityService.hash(props.password);
    const newUser = this.authRepository.create({ ...props, password: HashPassword });
    return newUser;
  }

}
