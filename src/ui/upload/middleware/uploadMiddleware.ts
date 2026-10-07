import multer from 'multer';

// Guardamos en memoria temporal para que el Repositorio de Infraestructura controle el guardado final en disco
const storage = multer.memoryStorage();

export const uploadSingleFile = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB
}).single('file');