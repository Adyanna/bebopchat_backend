import { PrismaEstadoRepository } from "@/infrastructure/status/prismaEstadoRepository";
import { DeleteExpiredStatus } from "@/domain/status/use-cases/deleteExpiredStatusUseCase";

export const deleteExpiredStatusTask = async () => {
  const estadoRepository = new PrismaEstadoRepository();
  const deleteExpiredStatus = new DeleteExpiredStatus(estadoRepository);

  return await deleteExpiredStatus.execute();
};
