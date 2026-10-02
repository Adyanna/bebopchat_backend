/*
  Warnings:

  - The `type` column on the `Chats` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `role` on the `ChatParticipants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Mensaje` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('INDIVIDUAL', 'GROUP');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'AUDIO', 'VIDEO');

-- AlterTable
ALTER TABLE "ChatParticipants" DROP COLUMN "role",
ADD COLUMN     "role" "ParticipantRole" NOT NULL;

-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "type",
ADD COLUMN     "type" "ChatType" NOT NULL DEFAULT 'INDIVIDUAL';

-- AlterTable
ALTER TABLE "Mensaje" DROP COLUMN "type",
ADD COLUMN     "type" "MessageType" NOT NULL;
