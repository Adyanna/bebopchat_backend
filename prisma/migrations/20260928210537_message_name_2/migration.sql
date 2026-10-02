/*
  Warnings:

  - You are about to drop the `Mensaje` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mensaje" DROP CONSTRAINT "Mensaje_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Mensaje" DROP CONSTRAINT "Mensaje_senderId_fkey";

-- DropTable
DROP TABLE "Mensaje";

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "multimediaUrl" TEXT,
    "type" "MessageType" NOT NULL,
    "senderId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
