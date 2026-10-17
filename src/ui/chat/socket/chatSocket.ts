import { Server, Socket } from 'socket.io';
import { PrismaChatRepository } from '@/infrastructure/chat/repositories/PrismaChatRepository';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';
import { PrismaMessageRepository } from '@/infrastructure/message/repositories/PrismaMessageRepository';
import { UpdatePendingMessagesUseCase } from '@/domain/message/use-cases/update-pending-messages';
import { registerCallSocket } from './callSocket';

export const registerChatSocket = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    console.log(`⚡ Conexión establecida. Socket ID: ${socket.id}`);
    console.log('Usuario autenticado:', socket.data.userId);

    const userId = socket.data.userId;

    registerCallSocket(io, socket);

    console.log('Usuario autenticado:', userId);
    // Vincular el usuario con su conexión
    socket.join(`user:${userId}`);
    console.log(`Usuario ${userId} vinculado a su conexión`);

    //ACTUALIZA TODOS LOS MENSAJES QUE ESTAN EN SEND A RECIBE 
    // POR QUE EL USUARIO SE CONECTO
    const messageRepository = new PrismaMessageRepository();
    const updatePendingMessagesUseCase = new UpdatePendingMessagesUseCase(messageRepository);
    console.log(userId, " - INGRESO A ACTUALIZACION DE MENSAJES DEL USUARIO")
    try {
      const messages = await updatePendingMessagesUseCase.execute({
        userId: Number(userId),
      });

      for (const message of messages) {
        io.to(`user:${message.senderId}`).emit("message_status_updated", {
          chatId: message.chatId,
          messageId: message.id,
          status: message.status,
        });
      }
      console.log(userId, " - FINALIZACION A ACTUALIZACION DE MENSAJES DEL USUARIO")

    } catch (error) {
      console.error('Error al actualizar mensajes pendientes:', error);
      socket.emit('socket_error', {
        message: 'No se pudieron actualizar los mensajes pendientes',
      });
    }

    socket.on('join_conversation', async (chatId: string) => {
      // socket.join(chatId);

      // console.log(
      //   `💬 El socket ${socket.id} se unió a la conversación: ${chatId}`,
      // );
      try {
        const userId = socket.data.userId;
        const chatRepository = new PrismaChatRepository();

        const chat = await chatRepository.findById(Number(chatId));

        if (!chat) {
          socket.emit('socket_error', {
            message: 'La conversación no existe',
          });
          return;
        }

        const isParticipant = chat.participants.some(
          (participant) => participant.userId === userId,
        );

        if (!isParticipant) {
          socket.emit('socket_error', {
            message: 'No perteneces a esta conversación',
          });
          return;
        }

        socket.join(`chat:${chatId}`);

        console.log(
          `💬 El usuario ${userId} se unió a la conversación ${chatId}`,
        );
        console.log(
          `✅ ÉXITO: El usuario ${userId} se unió a la conversación ${chatId}`,
        );

        socket.emit('joined_conversation', {
          chatId: Number(chatId),
          message: 'Entrada exitosa a la conversación',
        });
      } catch (error) {
        console.error('Error al unirse a la conversación:', error);

        socket.emit('socket_error', {
          message: 'No se pudo ingresar a la conversación',
        });
      }
    });


    socket.on('leave_conversation', (chatId: string) => {
      socket.leave(chatId);

      console.log(
        `🚪 El socket ${socket.id} salió de la conversación: ${chatId}`,
      );
    });

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });
};