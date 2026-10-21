export interface CreateEstadoParams {
    userId: number;
    content: string;
    type: number;
}

export interface DeleteEstadoParams {
    estadoId: number;
    userId: number;
}

export interface CreateViewParams {
    userId: number;
    estadoId: number;
}