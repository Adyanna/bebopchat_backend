/*
  Warnings:

  - You are about to drop the column `datetime` on the `Mensaje` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mensaje" DROP COLUMN "datetime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
