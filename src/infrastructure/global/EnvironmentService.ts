import dotenv from 'dotenv';
import {z} from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(['dev', 'test', 'staging', 'prod']),
  PORT: z.coerce.number().int().positive(),
  JWT_SECRET: z.string().min(5),
});

type EnvVars = z.infer<typeof envSchema>;

class EnvironmentService {
  private env: EnvVars | null = null;
  loadEnv(): void {
    if (this.env) return;
    dotenv.config();

    try {
      this.env = envSchema.parse(process.env);
      console.log('Environment variables loaded successfully:', this.env);
    } catch (error: unknown) {
      console.error(
        'Error parsing environment variables:',
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }
  get(): EnvVars {
    if (!this.env) {
      throw new Error('Environment variables not loaded');
    }
    return this.env;
  }
}

export const environmentService = new EnvironmentService();
