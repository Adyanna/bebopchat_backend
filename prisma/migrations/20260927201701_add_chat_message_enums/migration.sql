/*
  Warnings:

  - A unique constraint covering the columns `[userId,chatId]` on the table `ChatParticipants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,userContactId]` on the table `Contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Mensaje" ALTER COLUMN "multimediaUrl" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipants_userId_chatId_key" ON "ChatParticipants"("userId", "chatId");

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_userId_userContactId_key" ON "Contacts"("userId", "userContactId");
