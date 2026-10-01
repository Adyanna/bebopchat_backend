/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Perfil` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Perfil" ALTER COLUMN "photoUrl" DROP NOT NULL,
ALTER COLUMN "estadoCivil" DROP NOT NULL,
ALTER COLUMN "genero" DROP NOT NULL,
ALTER COLUMN "estadoAnimo" DROP NOT NULL,
ALTER COLUMN "Descripcion" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_userId_key" ON "Perfil"("userId");
