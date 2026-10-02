/*
  Warnings:

  - You are about to drop the column `descripcion` on the `Chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "descripcion",
ADD COLUMN     "description" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
