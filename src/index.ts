import app from './app';
import { environmentService } from '@/infrastructure/global/EnvironmentService';
// import cron from 'node-cron';

environmentService.loadEnv();

const { PORT, NODE_ENV } = environmentService.get();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// cron.schedule('0 7 * * 1', async () => {
//   console.log('MANEJO DE ESTADO, DAR DE BAJA EL SIACTIVE');
//   await TASK();
// });
