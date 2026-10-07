export type FileCategory = 'photos' | 'multimedia' | 'audio';

export interface FileToUpload {
  buffer: Buffer;
  originalname: string;
  tipo: FileCategory;
}
