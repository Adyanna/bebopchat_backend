import { EntityNotFoundError } from '@/domain/errors/EntityNotFoundError';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';
import { SecurityServices } from '@/domain/global/SecurityService';

import { AuthRepository } from '../repositories/authRepository';

export interface SigninUseCaseInput {
  phone: string;
  password: string;
}

export class SigninUseCase {
  private readonly authRepository: AuthRepository;
  private readonly securityService: SecurityServices;

  constructor(
    userRepository: AuthRepository,
    securityService: SecurityServices,
  ) {
    this.authRepository = userRepository;
    this.securityService = securityService;
  }

  async executeToken(data: SigninUseCaseInput): Promise<string> {
    const userData = await this.authRepository.findOneUser({
      phone: data.phone,
    });

    if (!userData) {
      throw new EntityNotFoundError('user', data.phone);
    }

    const isPasswordValid = await this.securityService.comparepassword(
      data.password,
      userData.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid phone or password');
    }

    const jwtToken = this.securityService.generateJwt(userData.id);

    return jwtToken;
  }
}