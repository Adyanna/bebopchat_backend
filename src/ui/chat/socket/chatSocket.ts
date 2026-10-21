import { Server, Socket } from 'socket.io';
import { PrismaChatRepository } from '@/infrastructure/chat/repositories/PrismaChatRepository';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';
import { PrismaMessageRepository } from '@/infrastructure/message/repositories/PrismaMessageRepository';
import { UpdatePendingMessagesUseCase } from '@/domain/message/use-cases/update-pending-messages';
import { registerCallSocket } from './callSocket';

export const registerChatSocket = (io: Server) => {
  io.on('connection', async (socket: Socket) => {

    const userId = socket.data.userId;

    registerCallSocket(io, socket);
    // Vincular el usuario con su conexión
    socket.join(`user:${userId}`);

    //ACTUALIZA TODOS LOS MENSAJES QUE ESTAN EN SEND A RECIBE 
    // POR QUE EL USUARIO SE CONECTO
    const messageRepository = new PrismaMessageRepository();
    const updatePendingMessagesUseCase = new UpdatePendingMessagesUseCase(messageRepository);
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

    } catch (error) {
      console.error('Error al actualizar mensajes pendientes:', error);
      socket.emit('socket_error', {
        message: 'No se pudieron actualizar los mensajes pendientes',
      });
    }

    socket.on('join_conversation', async (chatId: string) => {
      // socket.join(chatId);

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
    });

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });
};