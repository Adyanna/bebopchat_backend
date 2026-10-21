
import { StatusRepository } from "@/domain/status/repositories/statusRepository";
import type { CreateEstadoParams } from "../Status";

export class CreateStatus {
    constructor(
        private readonly estadoRepository: StatusRepository
    ) {}

    async execute(params: CreateEstadoParams) {
        return await this.estadoRepository.createEstado(params);
    }
}
