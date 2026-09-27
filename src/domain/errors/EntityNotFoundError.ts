import { DomainError } from './DomainError';

//STATUS 404
export class EntityNotFoundError extends DomainError {
  readonly name = 'EntityNotFoundError';

  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`);
  }
}
