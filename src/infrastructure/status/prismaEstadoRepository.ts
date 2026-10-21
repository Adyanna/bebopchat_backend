
import { prismaClient } from "@/infrastructure/global/PrismaCLient";

export class PrismaEstadoRepository {
    private readonly prisma = prismaClient;

    // Crear un estado
    async createEstado(params: {
        userId: number;
        content: string;
        type: number;
    }) {
        return await this.prisma.estados.create({
            data: {
                userId: params.userId,
                content: params.content,
                type: params.type,
            },
        });
    }

    // Eliminar un estado (borrado lógico)
    async deleteEstado(params: {
        estadoId: number;
        userId: number;
    }) {
        return await this.prisma.estados.updateMany({
            where: {
                id: params.estadoId,
                userId: params.userId,
                isActive: true,
            },
            data: {
                isActive: false,
            },
        });
    }

    // Registrar una visualización una sola vez
    async createView(params: {
        userId: number;
        estadoId: number;
    }) {
        const estado = await this.prisma.estados.findUnique({
            where: {
                id: params.estadoId,
            },
            select: {
                userId: true,
                isActive: true,
            },
        });

        // No registrar vistas del propio estado ni de estados inactivos
        if (
            !estado ||
            !estado.isActive ||
            estado.userId === params.userId
        ) {
            return null;
        }

        return await this.prisma.views.upsert({
            where: {
                userId_estadoId: {
                    userId: params.userId,
                    estadoId: params.estadoId,
                },
            },
            update: {},
            create: {
                userId: params.userId,
                estadoId: params.estadoId,
            },
        });
    }

    // Obtener mis estados con el número de visualizaciones
    async getMyEstados(userId: number) {
        return await this.prisma.estados.findMany({
            where: {
                userId,
                isActive: true,
            },
            include: {
                _count: {
                    select: {
                        views: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // Obtener los estados activos de mis contactos
    async getEstadosContactos(userId: number) {
        const contactos = await this.prisma.contacts.findMany({
            where: {
                userId,
            },
            select: {
                userContactId: true,
            },
        });

        const contactosIds = contactos.map(
            (contacto) => contacto.userContactId
        );

        if (contactosIds.length === 0) {
            return [];
        }

        return await this.prisma.estados.findMany({
            where: {
                userId: {
                    in: contactosIds,
                },
                isActive: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullname: true,
                        perfil: {
                            select: {
                                photoUrl: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // Desactivar los estados que cumplieron 24 horas
    async deleteExpiredEstados() {
        const fechaLimite = new Date(
            Date.now() - 24 * 60 * 60 * 1000
        );

        return await this.prisma.estados.updateMany({
            where: {
                isActive: true,
                createdAt: {
                    lte: fechaLimite,
                },
            },
            data: {
                isActive: false,
            },
        });
    }
}
