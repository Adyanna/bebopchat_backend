
import { StatusRepository } from "@/domain/status/repositories/statusRepository";

export class GetMyStatus {
    constructor(
        private readonly estadoRepository: StatusRepository
    ) {}

    async execute(userId: number) {
        return await this.estadoRepository.getMyEstados(userId);
    }
}
