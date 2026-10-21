
import { StatusRepository } from "@/domain/status/repositories/statusRepository";
import type { CreateViewParams } from "../Status";



export class CreateView {
    constructor(
        private readonly estadoRepository: StatusRepository
    ) {}

    async execute(params: CreateViewParams) {
        return await this.estadoRepository.createView(params);
    }
}
