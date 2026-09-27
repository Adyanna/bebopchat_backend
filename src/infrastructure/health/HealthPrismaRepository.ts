import { HealthRepository } from '@/domain/health/repository/HealthRepository';
import { prismaClient } from '@/infrastructure/global/PrismaCLient';

export class HealthPrismaRepository implements HealthRepository {
  private readonly prisma = prismaClient;

  async checkConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}