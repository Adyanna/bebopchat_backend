import fs from 'fs';
import path from 'path';
import {FileToUpload} from '@/domain/upload/Upload';
import {StorageRepository,} from '@/domain/upload/repositories/storageRepository';

export class StorageLocalRepository implements StorageRepository {
  private readonly baseUploadDir = path.join(process.cwd(), 'uploads');

  // CREATE / SAVE
  async saveFile({ buffer, originalname, tipo }: FileToUpload): Promise<string> {
    const targetFolder = path.join(this.baseUploadDir, tipo);

    // Crea la carpeta si no existe (uploads/photos, uploads/audio, etc.)
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    // Nombre único para evitar sobrescribir archivos
    const extension = path.extname(originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    const absolutePath = path.join(targetFolder, fileName);

    // Escribimos el buffer en el disco
    await fs.promises.writeFile(absolutePath, buffer);

    // Retornamos la URL relativa para la base de datos o respuesta
    return `/uploads/${tipo}/${fileName}`;
  }

  // DELETE
  async deleteFile(relativePath: string): Promise<boolean> {
    // Convierte '/uploads/photos/123.jpg' en ruta absoluta de sistema
    const absolutePath = path.join(process.cwd(), relativePath);

    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath);
      return true;
    }

    return false;
  }

  // GET / CHECK EXISTENCE
  async getFile(relativePath: string): Promise<string | null> {
    const absolutePath = path.join(process.cwd(), relativePath);

    if (fs.existsSync(absolutePath)) {
      return absolutePath;
    }

    return null;
  }
}