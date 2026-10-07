declare namespace Express {
  export interface Request {
    userId?: number; // Agrega la propiedad userId al objeto de solicitud
    file?: Express.Multer.File; // <-- Agregamos el tipo de archivo de Multer
  }
}
