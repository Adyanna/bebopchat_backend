import {
  StorageRepository,
} from '../repositories/storageRepository';

import { FileToUpload } from '../Upload';

export class UploadFileUseCase {
  constructor(private readonly storageRepository: StorageRepository) {}

  async executeUploadFile(data: FileToUpload): Promise<string> {
    return await this.storageRepository.saveFile(data);
  }
}