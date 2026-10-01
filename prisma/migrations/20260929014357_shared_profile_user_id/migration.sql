/*
  Warnings:

  - You are about to drop the column `Descripcion` on the `Perfil` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Perfil` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Perfil" DROP CONSTRAINT "Perfil_userId_fkey";

-- DropIndex
DROP INDEX "Perfil_userId_key";

-- AlterTable
ALTER TABLE "Perfil" DROP COLUMN "Descripcion",
DROP COLUMN "userId",
ADD COLUMN     "descripcion" TEXT,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Perfil_id_seq";

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
