import { DomainError } from './DomainError';

//STATUS 401
export class UnauthorizedError extends DomainError {
  readonly name = 'UnauthorizedError';

  constructor(message: string) {
    super(message || 'Invalid authentication token');
  }
}

export class AuthenticationError extends DomainError {
  readonly name = 'AuthenticationError';

  constructor(message: string) {
    super(message || 'Invalid email or password');
  }
}
