import { httpServer, io } from "./app";
import { environmentService } from "@/infrastructure/global/EnvironmentService";
import { registerChatSocket } from "./ui/chat/socket/chatSocket";
import { deleteExpiredStatusTask } from "./ui/status/tasks/deleteExpiredStatusTask";
import cron from "node-cron";

environmentService.loadEnv();

const { PORT, NODE_ENV } = environmentService.get();

registerChatSocket(io);

// 3. Arrancamos usando httpServer en lugar de app
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${NODE_ENV}]`);
});

cron.schedule("* * * * *", async () => {
  try {
    const result = await deleteExpiredStatusTask();

    if (result.count > 0) {
      console.log(`Estados desactivados: ${result.count}`);
    }
  } catch (error) {
    console.error("Error al desactivar estados expirados:", error);
  }
});
