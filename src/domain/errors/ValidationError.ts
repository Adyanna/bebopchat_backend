import { DomainError } from './DomainError';

//STATUS 400
export class ValidationError extends DomainError {
  readonly name = 'ValidationError';

  constructor(message: string) {
    super(message || 'Invalid request data');
  }
}

export class InvalidOperationError extends DomainError {
  readonly name = 'InvalidOperationError';

  constructor(message: string) {
    super(message || 'This operation is not allowed');
  }
}
