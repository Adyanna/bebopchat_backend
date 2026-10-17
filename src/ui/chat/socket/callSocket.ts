
import { Server, Socket } from 'socket.io';
import { PrismaChatRepository } from '@/infrastructure/chat/repositories/PrismaChatRepository';
import { Chat } from '@/domain/chat/Chat';

type Call = {
    chatId: number;
    callerId: number;
    targetUserId: number;
    status: 'pending' | 'active';
};

const calls = new Map<string, Call>();

const getCallKey = (chatId: number, callerId: number, targetUserId: number,) => `${chatId}:${callerId}:${targetUserId}`;

const findCall = (chatId: number, userA: number, userB: number) => {
    return calls.get(getCallKey(chatId, userA, userB)) ?? calls.get(getCallKey(chatId, userB, userA));
};

const isParticipant = (chat: Chat, userId: number) =>
    chat.participants.some((participant: { userId: number }) =>
        participant.userId === userId,
    );

export const registerCallSocket = (io: Server, socket: Socket) => {
    const getUserId = () => Number(socket.data.userId);

    socket.on('call_user', async (data: { chatId: number; targetUserId: number }) => {
        try {
            const callerId = getUserId();
            const { chatId, targetUserId } = data;

            if (!Number.isInteger(chatId) || !Number.isInteger(targetUserId) || callerId === targetUserId) {
                socket.emit('call_error', {
                    message: 'Datos de llamada inválidos',
                });
                return;
            }

            const repository = new PrismaChatRepository();
            const chat = await repository.findById(chatId);

            if (!chat || chat.type !== 'INDIVIDUAL' || !isParticipant(chat, callerId) || !isParticipant(chat, targetUserId)) {
                socket.emit('call_error', {
                    message: 'No tienes permiso para llamar a este usuario',
                });
                return;
            }

            if (findCall(chatId, callerId, targetUserId)) {
                socket.emit('call_error', {
                    message: 'Ya existe una llamada para este chat',
                });
                return;
            }

            calls.set(getCallKey(chatId, callerId, targetUserId), {
                chatId,
                callerId,
                targetUserId,
                status: 'pending',
            });

            io.to(`user:${targetUserId}`).emit('incoming_call', {
                chatId,
                callerId,
            });
        } catch (error) {
            console.error('Error al iniciar llamada:', error);
            socket.emit('call_error', {
                message: 'No se pudo iniciar la llamada',
            });
        }
    },
    );

    socket.on('accept_call', async (data: { chatId: number; targetUserId: number }) => {
        const receiverId = getUserId();
        const call = calls.get(getCallKey(data.chatId, data.targetUserId, receiverId));

        if (!call || call.status !== 'pending') {
            socket.emit('call_error', {
                message: 'La invitación ya no está disponible',
            });
            return;
        }

        call.status = 'active';

        io.to(`user:${call.callerId}`).emit('call_accepted', {
            chatId: call.chatId,
            userId: receiverId,
        });
    });

    socket.on('reject_call', (data: { chatId: number; targetUserId: number }) => {
        const receiverId = getUserId();
        const key = getCallKey(data.chatId, data.targetUserId, receiverId);
        const call = calls.get(key);

        if (!call || call.status !== 'pending') return;

        calls.delete(key);

        io.to(`user:${call.callerId}`).emit('call_rejected', {
            chatId: call.chatId,
            userId: receiverId,
        });
    },
    );

    socket.on('call_signal', async (data: { chatId: number; targetUserId: number; signal: unknown; }) => {
        try {
            const senderId = getUserId();
            const { chatId, targetUserId, signal } = data;

            if (!Number.isInteger(chatId) || !Number.isInteger(targetUserId) || senderId === targetUserId || !signal) {
                socket.emit('call_error', {
                    message: 'Datos de señalización inválidos',
                });
                return;
            }

            const call = findCall(chatId, senderId, targetUserId);

            if (!call || call.status !== 'active') {
                socket.emit('call_error', {
                    message: 'No hay una llamada activa entre estos usuarios',
                });
                return;
            }

            const repository = new PrismaChatRepository();
            const chat = await repository.findById(chatId);

            if (!chat || chat.type !== 'INDIVIDUAL' || !isParticipant(chat, senderId) || !isParticipant(chat, targetUserId)) {
                socket.emit('call_error', {
                    message: 'No tienes permiso para enviar esta señal',
                });
                return;
            }

            io.to(`user:${targetUserId}`).emit('call_signal', { chatId, fromUserId: senderId, signal, });
        } catch (error) {
            console.error('Error al reenviar señal:', error);
            socket.emit('call_error', {
                message: 'No se pudo enviar la señal',
            });
        }
    },
    );

    socket.on(
        'end_call',
        (data: { chatId: number; targetUserId: number }) => {
            const userId = getUserId();
            const call = findCall(data.chatId, userId, data.targetUserId);

            if (!call) return;

            calls.delete(
                getCallKey(call.chatId, call.callerId, call.targetUserId),
            );

            const otherUserId = call.callerId === userId ? call.targetUserId : call.callerId;

            io.to(`user:${otherUserId}`).emit('call_ended', {
                chatId: call.chatId,
                userId,
            });
        },
    );
};
