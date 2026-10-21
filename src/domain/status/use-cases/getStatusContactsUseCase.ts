
import { StatusRepository } from "@/domain/status/repositories/statusRepository";

export class GetStatusContacts {
    constructor(
        private readonly estadoRepository: StatusRepository
    ) {}

    async execute(userId: number) {
        return await this.estadoRepository.getEstadosContactos(userId);
    }
}
