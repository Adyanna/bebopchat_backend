export interface HealthRepository {
  checkConnection(): Promise<boolean>;
}

export class HealthUseCase {
  constructor(private readonly healthRepository: HealthRepository) {}

  async execute(): Promise<{ status: string }> {
    const isConnected = await this.healthRepository.checkConnection();

    if (!isConnected) {
      return {
        status: 'error',
      };
    }

    return {
      status: 'ok',
    };
  }
}