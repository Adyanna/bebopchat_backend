import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import { environmentService } from './EnvironmentService';

environmentService.loadEnv();

const adapter = new PrismaPg({
  connectionString: environmentService.get().DATABASE_URL,
});

export const prismaClient = new PrismaClient({
  adapter,
});