// import app from './app';
import { httpServer, io } from './app'; // 1. Importamos httpServer e io
import { environmentService } from '@/infrastructure/global/EnvironmentService';
import { registerChatSocket } from './ui/chat/socket/chatSocket';
// import cron from 'node-cron';

environmentService.loadEnv();

const { PORT, NODE_ENV } = environmentService.get();

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

registerChatSocket(io);

// 3. Arrancamos usando httpServer en lugar de app
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${NODE_ENV}]`);
});

// cron.schedule('0 7 * * 1', async () => {
//   console.log('MANEJO DE ESTADO, DAR DE BAJA EL SIACTIVE');
//   await TASK();
// });
