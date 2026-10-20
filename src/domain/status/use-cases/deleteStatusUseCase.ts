
import { StatusRepository } from "@/domain/status/repositories/statusRepository";
import type { DeleteEstadoParams } from "../Status";


export class DeleteStatus {
    constructor(
        private readonly estadoRepository: StatusRepository
    ) {}

    async execute(params: DeleteEstadoParams) {
        return await this.estadoRepository.deleteEstado(params);
    }
}
