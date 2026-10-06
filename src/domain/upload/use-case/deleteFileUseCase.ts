import { StorageRepository } from '../repositories/storageRepository';

export class DeleteFileUseCase {
  constructor(private readonly storageRepository: StorageRepository) {}

  async execute(filePath: string): Promise<boolean> {
    return await this.storageRepository.deleteFile(filePath);
  }
}