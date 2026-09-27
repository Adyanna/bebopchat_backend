import { DomainError } from './DomainError';

//status 409
export class BusinessConflictError extends DomainError {
  readonly name = 'BusinessConflictError';

  constructor(message?: string) {
    super(message || 'A business conflict has occurred');
  }
}
