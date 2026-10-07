import { FileCategory,FileToUpload } from "../Upload";

export interface StorageRepository {
  saveFile(fileData: FileToUpload): Promise<string>; // Devuelve la ruta pública: /uploads/photos/123.jpg
  deleteFile(filePath: string): Promise<boolean>;   // Elimina el archivo del disco
  getFile(filePath: string): Promise<string | null>; // Verifica o obtiene la ruta absoluta del archivo
}