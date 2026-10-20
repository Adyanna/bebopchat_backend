/*
  Warnings:

  - A unique constraint covering the columns `[userId,estadoId]` on the table `Views` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Views_userId_estadoId_key" ON "Views"("userId", "estadoId");
