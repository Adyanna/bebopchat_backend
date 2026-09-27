export interface HealthRepository {
  checkConnection(): Promise<boolean>;
}