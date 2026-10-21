
import { StatusRepository } from "@/domain/status/repositories/statusRepository";

export class DeleteExpiredStatus {
    constructor(
        private readonly estadoRepository: StatusRepository
    ) {}

    async execute() {
        return await this.estadoRepository.deleteExpiredEstados();
    }
}
