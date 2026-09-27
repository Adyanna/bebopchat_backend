import { DomainError } from './DomainError';

//STATUS 403
export class ForbiddenError extends DomainError {
  readonly name = 'forbiddenError';
  readonly message = 'Forbidden';

  constructor(message?: string) {
    super(message || 'You do not have permission to perform this action');
  }
}
