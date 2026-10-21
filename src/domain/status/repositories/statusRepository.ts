
export interface StatusRepository {
    createEstado(params: {
        userId: number;
        content: string;
        type: number;
    }): Promise<any>;
    deleteEstado(params: {
        estadoId: number;
        userId: number;
    }): Promise<any>;
    createView(params: {
        userId: number;
        estadoId: number;
    }): Promise<any>;
    getMyEstados(userId: number): Promise<any[]>;
    getEstadosContactos(userId: number): Promise<any[]>;
    deleteExpiredEstados(): Promise<any>;
}
